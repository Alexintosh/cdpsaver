pragma solidity 0.5.0;

import "./interfaces/TubInterface.sol";
import "./interfaces/ProxyRegistryInterface.sol";
import "./interfaces/ERC20.sol";
import "./DS/DSMath.sol";

contract Monitor is DSMath {

    PipInterface pip = PipInterface(0xA944bd4b25C9F186A846fd5668941AA3d3B8425F); //KOVAN
    TubInterface tub = TubInterface(0xa71937147b55Deb8a530C7229C442Fd3F31b7db2); //KOVAN
    ProxyRegistryInterface registry = ProxyRegistryInterface(0x64A436ae831C1672AE81F674CAb8B6775df3475C); //KOVAN

    address public saverProxy;

    struct CupHolder {
        bytes32 cup;
        uint minRatio;
        uint timeCreated;
        bool exists;
    }

    uint constant MIN_RATIO = 150;

    mapping(address => CupHolder) public hodlers;

    constructor(address _saverProxy) public {
        saverProxy = _saverProxy;
    }

    //TODO: what if user changes the proxy or cdp changes owners??
    function subscribe(bytes32 _cup, uint _minRatio) public {
        require(isOwner(msg.sender, _cup));
        require(_minRatio >= MIN_RATIO + 1);

        DSProxyInterface proxy = registry.proxies(msg.sender);

        if (hodlers[address(proxy)].exists) {
            hodlers[address(proxy)].minRatio = _minRatio;
        } else {
            hodlers[address(proxy)] = CupHolder({
                cup: _cup,
                minRatio: _minRatio,
                timeCreated: now,
                exists: true
            });
        }
    }

    function unsubscribe(bytes32 _cup) public {
        require(isOwner(msg.sender, _cup));

        DSProxyInterface proxy = registry.proxies(msg.sender);

        hodlers[address(proxy)].exists = false;
    }

    function saveUser(address _user) public {
        DSProxyInterface proxy = registry.proxies(_user);

        require(address(proxy) != address(0));
        require(hodlers[address(proxy)].exists);
        require(getRatio(hodlers[address(proxy)].cup) <= hodlers[address(proxy)].minRatio);

        proxy.execute(saverProxy, abi.encodeWithSignature("repay(uint256)", uint(hodlers[address(proxy)].cup)));

    }

    function getRatio(bytes32 _cdpId) public returns(uint) {
        return (wdiv(rmul(rmul(tub.ink(_cdpId), tub.tag()), WAD), tub.tab(_cdpId)))/10000000;
    }

    function isOwner(address _owner, bytes32 _cup) internal returns(bool) {
         DSProxyInterface reg = registry.proxies(_owner);
         
         require(tub.lad(_cup) == address(reg));
         require(reg.owner() == msg.sender);

         if(address(reg) != address(0x0)) {
             return true;
         }
        
        return false;
    }
}
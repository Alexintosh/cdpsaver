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

    struct CdpHolder {
        uint minRatio;
        uint slippageLimit;
        address owner;
    }

    mapping(bytes32 => CdpHolder) public holders;

    event Subscribed(address indexed owner, bytes32 cdpId);
    event CdpRepay(bytes32 indexed cdpId, address indexed caller);

    constructor(address _saverProxy) public {
        saverProxy = _saverProxy;
    }

    /// @dev User should be owner of CDP and have a DSProxy controlling it
    function subscribe(bytes32 _cdpId, uint _minRatio, uint _slippageLimit) public {
        require(isOwner(msg.sender, _cdpId));

        holders[_cdpId] = CdpHolder({
            minRatio: _minRatio,
            slippageLimit: _slippageLimit,
            owner: msg.sender
        });

        emit Subscribed(msg.sender, _cdpId);
    }

    function unsubscribe(bytes32 _cdpId) public {
        require(isOwner(msg.sender, _cdpId));

        delete holders[_cdpId];
    }

    /// @dev Should be callable by anyone
    function saveCdp(bytes32 _cdpId) public {
        CdpHolder memory holder = holders[_cdpId];

        require(holder.owner != address(0));

        DSProxyInterface proxy = registry.proxies(holder.owner);

        require(getRatio(_cdpId) <= holders[_cdpId].minRatio);

        proxy.execute(saverProxy, abi.encodeWithSignature("repay(bytes32,uint256,bool)", _cdpId, 0, true));

        emit CdpRepay(_cdpId, msg.sender);
    }

    function getRatio(bytes32 _cdpId) public returns(uint) {
        return (wdiv(rmul(rmul(tub.ink(_cdpId), tub.tag()), WAD), tub.tab(_cdpId)))/10000000;
    }

    function isOwner(address _owner, bytes32 _cdpId) internal returns(bool) {
        DSProxyInterface proxy = registry.proxies(_owner);
        
        require(address(proxy) != address(0));
        require(tub.lad(_cdpId) == address(proxy));
        require(proxy.owner() == msg.sender);
        
        return true;
    }
}
pragma solidity ^0.5.0;

import "./interfaces/TubInterface.sol";
import "./DS/DSMath.sol";
import "./DS/DSProxy.sol";


contract Monitor is DSMath {

    PipInterface pip = PipInterface(0xA944bd4b25C9F186A846fd5668941AA3d3B8425F); //KOVAN
    TubInterface tub = TubInterface(0xa71937147b55Deb8a530C7229C442Fd3F31b7db2); //KOVAN

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

    function subscribe(bytes32 _cup, uint _minRatio) public {
        require(msg.sender == tub.lad(_cup));
        require(_minRatio >= MIN_RATIO + 1);

        if (hodlers[msg.sender].exists) {
            hodlers[msg.sender].minRatio = _minRatio;
        } else {
            hodlers[msg.sender] = CupHolder({
                cup: _cup,
                minRatio: _minRatio,
                timeCreated: now,
                exists: true
            });
        }
    }

    function unsubscribe(bytes32 _cup) public {
        require(msg.sender == tub.lad(_cup));

        hodlers[msg.sender].exists = false;
    }

    function saveUser(address payable _user) public {
        require(hodlers[_user].exists);
        require(getRatio(hodlers[_user].cup) <= hodlers[_user].minRatio);

        DSProxy(_user).execute(saverProxy, abi.encodeWithSignature("repay(uint)", uint(hodlers[_user].cup)));

    }

    function getRatio(bytes32 _cdpId) public returns(uint) {
        return (wdiv(rmul(rmul(tub.ink(_cdpId), tub.tag()), WAD), tub.tab(_cdpId)))/10000000;
    }

}
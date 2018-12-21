pragma solidity ^0.5.0;

import "./DSProxy.sol";
import "./CDPInterface.sol";
import "./Marketplace.sol";
import "./SaverProxy.sol";
import "./ERC20.sol";

//TODO: ProxyRegistry contract?
contract UserProxy is DSProxy(address(0)) {
    uint public cdpId;

    address public owner;

    CDPInterface cdp = CDPInterface(0x448a5065aeBB8E423F0896E6c5D525C040f59af3);
    Marketplace marketplace; //TODO: switch to interface
    SaverProxy saverProxy; //TODO: switch to interface

    mapping (address => bool) public approved;

    constructor(uint _cdpId, address _marketplace, address _saverProxy, address _owner) public {
        owner = _owner;
        cdpId = _cdpId;
        marketplace = Marketplace(_marketplace);
        saverProxy = SaverProxy(_saverProxy);

        //Approve token transfers to Maker dao contract
        //TODO: possibly find better place to put it
        ERC20 makerToken = ERC20(0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD); //KOVAN MAKER
        makerToken.approve(0xa71937147b55Deb8a530C7229C442Fd3F31b7db2, uint(-1)); //KOVAN TUB ADDRESS

        ERC20 daiToken = ERC20(0xC4375B7De8af5a38a93548eb8453a498222C4fF2); //KOVAN DAI
        daiToken.approve(0xa71937147b55Deb8a530C7229C442Fd3F31b7db2, uint(-1));
    }

    function transferFrom(address _to) public {
        require(msg.sender == owner || approved[msg.sender] == true, "Only the owner or an approved address can transfer");
        require(_to != address(0), "Stop the user from transfering the cup into a empty address");

        cdp.give(bytes32(cdpId), _to);
    }

    function approve(address _spender, bool _isApproved) public auth {

        approved[_spender] = _isApproved;
    }

    function startUnwind(address _tub) public auth {
        saverProxy.unwind(_tub, cdpId);

    }

}
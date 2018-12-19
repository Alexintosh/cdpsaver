pragma solidity ^0.5.0;

import "./DSProxy.sol";
import "./CDPInterface.sol";
import "./Marketplace.sol";

contract UserProxy is DSProxy {
    address public owner;
    uint public cdpId;

    CDPInterface cdp = CDPInterface(0x448a5065aeBB8E423F0896E6c5D525C040f59af3);
    Marketplace marketplace; //TODO: switch to interface

    mapping (address => bool) public approved;

    constructor(uint _cdpId, address _marketplace) public {
        owner = msg.sender;
        cdpId = _cdpId;
        marketplace = Marketplace(_marketplace);
    }

    function transferFrom(address _to) public {
        require(msg.sender == owner || approved[msg.sender] == true, "Only the owner or an approved address can transfer");
        require(_to != address(0), "Stop the user from transfering the cup into a empty address");

        cdp.give(bytes32(cdpId), _to);
    }

    function approve(address _spender, bool _isApproved) public {
        require(msg.sender == owner, "Only the owner can approve an address");

        approved[_spender] = _isApproved;
    }

}
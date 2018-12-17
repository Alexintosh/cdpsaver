pragma solidity ^0.4.24; //TODO: new version 

//NOTICE: prototype to test out different ideas of handling cdps

contract CDPInterface {
    function open() public returns (bytes32 cup);
    function give(bytes32 cup, address guy) public;
    function lock(bytes32 cup, uint wad) public;
    function free(bytes32 cup, uint wad) public;
    function draw(bytes32 cup, uint wad) public;
    function wipe(bytes32 cup, uint wad) public;
    function shut(bytes32 cup) public;
    function bite(bytes32 cup) public;
}


//TODO: some sort of fancy proxy factory patter to avoid high gas cost
//NOTICE: can we group this into 1 call, transfer cdp to the contract and then deploy it?
contract UserProxyContract {
    address owner;
    bytes32 cdpId;

    CDPInterface cdp = CDPInterface(0x448a5065aebb8e423f0896e6c5d525c040f59af3);

    constructor(bytes32 _cdpId) public {
        owner = msg.sender;
        cdpId = _cdpId;

    }

    function transfer(address _to) public {
        require(owner == msg.sender);

        cdp.give(cdpId, _to);
    }

}

contract Marketplace {

    struct SaleItem {
        uint price;
        uint time;
        address owner;
    }

    mapping (uint => SaleItem) public items;
    uint[] public itemsArr;

    function putOnSale(uint cdpId, uint price) public {

    }

    function buy(uint cdpId) public {

    }

    function cancel(uint cdpId) public {

    }

}
pragma solidity ^0.5.0;

import "./DS/DSProxy.sol";
import "./interfaces/TubInterface.sol";

contract Marketplace is DSAuth {

    struct SaleItem {
        uint price;
        uint time;
        address payable lad;
        bool active;
    }

    mapping (bytes32 => SaleItem) public items;
    bytes32[] public itemsArr;

    // address constant TUB_ADDRESS = 0x448a5065aebb8e423f0896e6c5d525c040f59af3;
    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2; //KOVAN

    TubInterface cdp = TubInterface(TUB_ADDRESS);

    event OnSale(bytes32 indexed cup, address indexed lad, uint price);
    event Bought(bytes32 indexed cup, address indexed newLad, address indexed oldLad, uint price);

    function putOnSale(bytes32 _cup, uint _price) public {
        require(cdp.lad(_cup) == msg.sender, "msg.sender must be cup owner");

        items[_cup] = SaleItem({
            price: _price,
            time: now,
            lad: msg.sender,
            active: true
        });

        itemsArr.push(_cup);

        emit OnSale(_cup, msg.sender, _price);

    }

    function buy(bytes32 _cup) public payable {
        require(items[_cup].active == true, "Check if cup is on sale");
        require(msg.value >= items[_cup].price, "Check if enough ether is sent for this cup");

        DSProxy usersProxy =  DSProxy(items[_cup].lad);

        // give the cup to the buyer, him becoming the lad that owns the cup
        usersProxy.execute(TUB_ADDRESS, 
            abi.encodeWithSignature("give(bytes32, address)", _cup, msg.sender));

        //TODO: take a fee?

        items[_cup].lad.transfer(items[_cup].price); // transfer money to the seller

        //TODO: delete the sales item
        items[_cup].active = false;
    }

    function cancel(uint cdpId) public {

    }

}

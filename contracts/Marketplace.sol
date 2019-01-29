pragma solidity ^0.5.0;

import "./DS/DSProxy.sol";
import "./DS/DSMath.sol";
import "./interfaces/TubInterface.sol";
import "./interfaces/ProxyRegistryInterface.sol";

contract Marketplace is DSAuth, DSMath {

    struct SaleItem {
        address payable owner;
        uint discount;
        bool active;
    }
 
    mapping (bytes32 => uint) public items;
    SaleItem[] public itemsArr;

    address public marketplaceProxy;

    uint public fee = 1; // Fee is 1%

    ProxyRegistryInterface registry = ProxyRegistryInterface(0x64A436ae831C1672AE81F674CAb8B6775df3475C); //KOVAN
    TubInterface tub = TubInterface(0xa71937147b55Deb8a530C7229C442Fd3F31b7db2);

    event OnSale(bytes32 indexed cup, address indexed lad, uint discount);
    event Bought(bytes32 indexed cup, address indexed newLad, address indexed oldLad, uint discount);

    constructor(address _marketplaceProxy) public {
        marketplaceProxy = _marketplaceProxy;
    }

    function putOnSale(bytes32 _cup, uint _discount) public {
        require(isOwner(msg.sender, _cup), "msg.sender must be owner of proxy which owns the cup");
        require(_discount < 100, "can't have 100% discount, just put fixedPrice 0");

        DSProxy proxy = registry.proxies(msg.sender);

        itemsArr.push(SaleItem({
            discount: _discount,
            owner: address(proxy),
            active: true
        }));

        items[_cup] = itemsArr.length - 1;

        emit OnSale(_cup, msg.sender, _discount);

    }

    function buy(bytes32 _cup) public payable {
        uint itemIndex = items[_cup];
        SaleItem storage item = itemsArr[itemIndex];

        require(item.active == true, "Check if cup is on sale");

        uint collateral = rmul(tub.ink(_cup), tub.tag());
        uint debt = tub.tab(_cup);

        uint ethAmount = ((collateral - debt) * (100 - (item.discount - fee))) / 100;

        require(msg.value >= ethAmount, "Check if enough ether is sent for this cup");

        uint price = ((collateral - debt) * (100 - (item.discount))) / 100;

        item.active = false;

        // give the cup to the buyer, him becoming the lad that owns the cup
        DSProxy(item.owner).execute(marketplaceProxy, 
            abi.encodeWithSignature("give(bytes32, address)", _cup, msg.sender));


        item.owner.transfer(price); // transfer money to the seller

        emit Bought(_cup, msg.sender, item.owner, item.discount);

        removeItem(itemIndex);

    }

    function cancel(bytes32 _cup) public {
        require(isOwner(msg.sender, _cup), "msg.sender must be owner of proxy which owns the cup");

        uint itemIndex = items[_cup];
        
        removeItem(itemIndex);
    }

    function withdraw() public auth {
        msg.sender.transfer(address(this).balance);
    }

    function removeItem(uint itemIndex) internal {
        itemsArr[itemIndex] = itemsArr[itemsArr.length - 1];
        delete itemsArr[itemsArr.length - 1];
        itemsArr.length--;
    }

    function isOwner(address _owner, bytes32 _cup) internal view returns(bool) {
        DSProxy proxy = registry.proxies(_owner);
         
        require(tub.lad(_cup) == address(proxy));

        if (address(proxy) != address(0x0)) {
            return true;
        }
        
        return false;
    }

}

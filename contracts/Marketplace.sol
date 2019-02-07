pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./DS/DSProxy.sol";
import "./DS/DSMath.sol";
import "./interfaces/TubInterface.sol";
import "./interfaces/ProxyRegistryInterface.sol";


contract Marketplace is DSAuth, DSMath {

    struct SaleItem {
        address payable owner;
        uint discount;
        bytes32 cup;
        bool active;
    }
 
    mapping (bytes32 => uint) public items;
    SaleItem[] public itemsArr;

    address public marketplaceProxy;

    uint public fee = 100; //1% fee

    // KOVAN
    ProxyRegistryInterface public registry = ProxyRegistryInterface(0x64A436ae831C1672AE81F674CAb8B6775df3475C);
    TubInterface public tub = TubInterface(0xa71937147b55Deb8a530C7229C442Fd3F31b7db2);

    event OnSale(bytes32 indexed cup, address indexed lad, uint discount);
    event Bought(bytes32 indexed cup, address indexed newLad, address indexed oldLad, uint discount);

    constructor(address _marketplaceProxy) public {
        marketplaceProxy = _marketplaceProxy;
    }

    function putOnSale(bytes32 _cup, uint _discount) public {
        require(isOwner(msg.sender, _cup), "msg.sender must be proxy which owns the cup");
        require(_discount < 10000, "can't have 100% discount");
        require(tub.ink(_cup) > 0 && tub.tab(_cup) > 0, "must have collateral and debt to put on sale");

        itemsArr.push(SaleItem({
            discount: _discount,
            owner: msg.sender,
            cup: _cup,
            active: true
        }));

        items[_cup] = itemsArr.length - 1;

        emit OnSale(_cup, msg.sender, _discount);

    }

    function buy(bytes32 _cup) public payable {
        uint itemIndex = items[_cup];
        SaleItem storage item = itemsArr[itemIndex];

        require(item.active == true, "Check if cup is on sale");

        uint cdpPrice;
        uint cdpPriceWithoutFee;

        (cdpPrice, cdpPriceWithoutFee) = getCdpValue(_cup);

        require(msg.value >= cdpPrice, "Check if enough ether is sent for this cup");

        item.active = false;

        // give the cup to the buyer, him becoming the lad that owns the cup
        DSProxy(item.owner).execute(marketplaceProxy, 
            abi.encodeWithSignature("give(bytes32,address)", _cup, msg.sender));


        item.owner.transfer(cdpPriceWithoutFee); // transfer money to the seller

        emit Bought(_cup, msg.sender, item.owner, item.discount);

        removeItem(itemIndex);

    }

    function cancel(bytes32 _cup) public {
        require(isOwner(msg.sender, _cup), "msg.sender must proxy which owns the cup");
        require(isOnSale(_cup), "only cancel cdps that are on sale");
        
        removeItem(items[_cup]);
    }

    // ONLY OWNER
    function withdraw() public auth {
        msg.sender.transfer(address(this).balance);
    }

    function getCdpValue(bytes32 _cup) public returns(uint, uint) {
        SaleItem memory item = itemsArr[items[_cup]];

        uint ethPrice = uint(tub.pip().read());

        uint collateral = rmul(tub.ink(_cup), tub.per()); // collateral in Eth
        uint govFee = wdiv(rmul(tub.tab(_cup), rdiv(tub.rap(_cup), tub.tab(_cup))), ethPrice);
        uint debt = add(govFee, wdiv(tub.tab(_cup), ethPrice)); // debt in Eth

        uint cdpPrice = mul(sub(collateral, debt), (sub(10000, sub(item.discount, fee)))) / 10000;
        uint withoutFee = mul(sub(collateral, debt), sub(10000, item.discount)) / 10000;

        return (cdpPrice, withoutFee);
    }

    function getItemsOnSale() public view returns(SaleItem[] memory) {
        return itemsArr;
    }

    function isOnSale(bytes32 _cup) public view returns (bool) {
        uint pos = items[_cup];

        if (itemsArr.length == 0 || pos >= itemsArr.length) {
            return false;
        } else {
            return itemsArr[pos].active == true && itemsArr[pos].cup == _cup;
        }
    }

    function removeItem(uint itemIndex) internal {
        itemsArr[itemIndex] = itemsArr[itemsArr.length - 1];

        items[itemsArr[itemsArr.length - 1].cup] = itemIndex;

        delete itemsArr[itemsArr.length - 1];
        itemsArr.length--;
    }

    function isOwner(address _owner, bytes32 _cup) internal view returns(bool) {         
        require(tub.lad(_cup) == _owner);

        return true;
    }

}

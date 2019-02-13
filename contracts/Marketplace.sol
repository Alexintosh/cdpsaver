pragma solidity 0.5.0;

import "./DS/DSProxy.sol";
import "./DS/DSMath.sol";
import "./interfaces/TubInterface.sol";
import "./interfaces/ProxyRegistryInterface.sol";


contract Marketplace is DSAuth, DSMath {

    struct SaleItem {
        address payable owner;
        address payable proxy;
        uint discount;
        bool active;
    }
 
    mapping (bytes32 => SaleItem) public items;
    mapping (bytes32 => uint) public itemPos;
    bytes32[] public itemsArr;

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

        address payable owner = address(uint160(DSProxy(msg.sender).owner()));

        items[_cup] = SaleItem({
            discount: _discount,
            proxy: msg.sender,
            owner: owner,
            active: true
        });

        itemsArr.push(_cup);
        itemPos[_cup] = itemsArr.length - 1;

        emit OnSale(_cup, msg.sender, _discount);

    }

    function buy(bytes32 _cup) public payable {
        SaleItem storage item = items[_cup];

        require(item.active == true, "Check if cup is on sale");

        uint cdpPrice;
        uint ownerFeeAmount;

        (cdpPrice, ownerFeeAmount) = getCdpValue(_cup);

        require(msg.value >= cdpPrice, "Check if enough ether is sent for this cup");

        item.active = false;

        // give the cup to the buyer, him becoming the lad that owns the cup
        DSProxy(item.proxy).execute(marketplaceProxy, 
            abi.encodeWithSignature("give(bytes32,address)", _cup, msg.sender));

        item.owner.transfer(sub(cdpPrice, ownerFeeAmount)); // transfer money to the seller

        emit Bought(_cup, msg.sender, item.owner, item.discount);

        removeItem(_cup);

    }

    function cancel(bytes32 _cup) public {
        require(isOwner(msg.sender, _cup), "msg.sender must proxy which owns the cup");
        require(isOnSale(_cup), "only cancel cdps that are on sale");
        
        removeItem(_cup);
    }

    // ONLY OWNER
    function withdraw() public auth {
        msg.sender.transfer(address(this).balance);
    }

    function getCdpValue(bytes32 _cup) public returns(uint, uint) {
        SaleItem memory item = items[_cup];

        uint collateral = rmul(tub.ink(_cup), tub.per()); // collateral in Eth
        uint govFee = wdiv(rmul(tub.tab(_cup), rdiv(tub.rap(_cup), tub.tab(_cup))), uint(tub.pip().read()));
        uint debt = add(govFee, wdiv(tub.tab(_cup), uint(tub.pip().read()))); // debt in Eth

        uint difference = 0;

        if (item.discount > fee) {
            difference = sub(item.discount, fee);
        } else {
            difference = item.discount;
        }

        uint cdpPrice = mul(sub(collateral, debt), (sub(10000, difference))) / 10000;
        uint ownerFeeAmount = mul(sub(collateral, debt), fee) / 10000;

        return (cdpPrice, ownerFeeAmount);
    }

    function getItemsOnSale() public view returns(bytes32[] memory) {
        return itemsArr;
    }

    function isOnSale(bytes32 _cup) public view returns (bool) {
        return items[_cup].active;
    }

    function removeItem(bytes32 _cup) internal {
        delete items[_cup];

        uint index = itemPos[_cup];
        itemsArr[index] = itemsArr[itemsArr.length - 1];

        itemPos[_cup] = 0;
        itemPos[itemsArr[itemsArr.length - 1]] = index;

        itemsArr.length--;
    }

    function isOwner(address _owner, bytes32 _cup) internal view returns(bool) {         
        require(tub.lad(_cup) == _owner);

        return true;
    }

}

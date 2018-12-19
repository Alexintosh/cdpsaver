pragma solidity ^0.5.0;

import "./CDPInterface.sol";
import "./Marketplace.sol";

contract MarketplaceProxy {
    
    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2; //KOVAN
    CDPInterface cdp = CDPInterface(TUB_ADDRESS);
    
    Marketplace public marketplace;
    
    constructor(address _marketplace) public {
        marketplace = Marketplace(_marketplace);
    }
    
    function marketSale(uint _cupId, uint _price) public {
        marketplace.putOnSale(_cupId, _price);
    }
    
    function transfer(uint _cupId, address _newOwner) public {
        cdp.give(bytes32(_cupId), _newOwner);
    }
}
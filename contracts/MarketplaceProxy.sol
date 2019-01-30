pragma solidity ^0.5.0;

import "./interfaces/TubInterface.sol";
import "./DS/DSAuthority.sol";
import "./DS/DSAuth.sol";
import "./Marketplace.sol";

contract MarketplaceProxy {

    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;

    function give(bytes32 _cup, address _newOwner) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);

        tub.give(_cup, _newOwner);
    }

    function authorizeAndSell(bytes32 _cup, uint _discount, address _proxy, address _marketplace, DSAuthority _authority) public {
        DSAuth(_proxy).setAuthority(_authority);

        Marketplace(_marketplace).putOnSale(_cup, _discount);
    }

    function cancel(address _marketplace, bytes32 _cup) public {
        Marketplace(_marketplace).cancel(_cup);
    }
}
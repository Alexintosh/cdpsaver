pragma solidity ^0.5.0;

import "./interfaces/TubInterface.sol";

contract MarketplaceProxy {

    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;

    function give(bytes32 _cup, address _newOwner) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);

        tub.give(_cup, _newOwner);
    }
}
pragma solidity 0.5.0;

import "./interfaces/TubInterface.sol";
import "./DS/DSGuard.sol";
import "./Marketplace.sol";

contract MarketplaceProxy {

    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;
    address constant FACTORY_ADDRESS = 0xc72E74E474682680a414b506699bBcA44ab9a930;

    function give(bytes32 _cup, address _newOwner) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);

        tub.give(_cup, _newOwner);
    }

    function createAuthorizeAndSell(bytes32 _cup, uint _discount, address _proxy, address _marketplace) public {
        DSGuard guard = DSGuardFactory(FACTORY_ADDRESS).newGuard();
        DSAuth(_proxy).setAuthority(DSAuthority(address(guard)));

        guard.permit(_marketplace, _proxy, bytes4(keccak256("execute(address,bytes)")));

        Marketplace(_marketplace).putOnSale(_cup, _discount);
    }

    function authorizeAndSell(bytes32 _cup, uint _discount, address _proxy, address _marketplace) public {
        DSGuard guard = DSGuard(address(DSAuth(_proxy).authority));
        guard.permit(_marketplace, _proxy, bytes4(keccak256("execute(address,bytes)")));

        Marketplace(_marketplace).putOnSale(_cup, _discount);
    }

    function sell(bytes32 _cup, uint _discount, address _marketplace) public {
        Marketplace(_marketplace).putOnSale(_cup, _discount);
    }

    function cancel(address _marketplace, bytes32 _cup) public {
        Marketplace(_marketplace).cancel(_cup);
    }
}
pragma solidity ^0.5.0;

import "./interfaces/CDPInterface.sol";
import "./interfaces/ERC20.sol";
import "./interfaces/KyberNetworkProxyInterface.sol";
import "./DS/DSProxy.sol";

contract SaverProxy {
    function unwind(address _tub, uint _cdpId) public {
        CDPInterface cdp = CDPInterface(_tub);

        uint maxCollateral = getMaxFreeCollateral();

        cdp.free(bytes32(_cdpId), maxCollateral);

        uint daiAmount = swapEtherToToken();

        //User needs maker
        cdp.wipe(bytes32(_cdpId), daiAmount);
    }

    //TODO: watch out for gas price limits
    function swapEtherToToken () internal returns(uint) {

        uint minRate;
        ERC20 ETH_TOKEN_ADDRESS = ERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
        ERC20 daiToken = ERC20(0xC4375B7De8af5a38a93548eb8453a498222C4fF2); //KOVAN ADDRESS

        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(0x7e6b8b9510D71BF8EF0f893902EbB9C865eEF4Df); //KOVAN ADDRESS

        (, minRate) = _kyberNetworkProxy.getExpectedRate(ETH_TOKEN_ADDRESS, daiToken, msg.value);

        //will send back tokens to this contract's address
        uint destAmount = _kyberNetworkProxy.swapEtherToToken.value(msg.value)(daiToken, minRate);

        return destAmount;
    }

    //TODO: calculate what is the max amount of collateral you can get
    function getMaxFreeCollateral() pure internal returns(uint) {
        return 10000;
    }

    ///@notice Creates a new UserProxy and transfer and existing cdp to it
    function createUserProxyAndTransfer(address _tub, uint _cdpId, address _marketplace) public {
        CDPInterface cdp = CDPInterface(_tub);

        require(msg.sender == cdp.lad(bytes32(_cdpId)), "The caller must be the cdp owner");

        DSProxy newProxy = new DSProxy(address(0)); //TODO: should we set a cache address?

        cdp.give(bytes32(_cdpId), address(newProxy));
    }
}
pragma solidity ^0.5.0;

import "./interfaces/TubInterface.sol";
import "./interfaces/ERC20.sol";
import "./interfaces/KyberNetworkProxyInterface.sol";
import "./SaiProxy.sol";

contract IVox {
    function par() public returns (uint); //ref per dai
}

contract SaverProxy is SaiProxy {

    function repay(address _tub, address _vox, uint _cdpId) public {
        TubInterface tub = TubInterface(_tub);
        bytes32 cup = bytes32(_cdpId);

        uint maxCollateral = maxFreeCollateral(tub, _vox, bytes32(_cdpId));

        free(_tub, cup, maxCollateral);

        //convert eth -> dai
        //swapEtherToToken();

        //wipe() debt

        
    }

    function boost(address _tub, uint _cdpId) public {
        TubInterface cdp = TubInterface(_tub);
    }

    //TODO: watch out for gas price limits
    function swapEtherToToken (uint _ethAmount) internal returns(uint) {

        uint minRate;
        ERC20 ETH_TOKEN_ADDRESS = ERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
        ERC20 daiToken = ERC20(0xC4375B7De8af5a38a93548eb8453a498222C4fF2); //KOVAN ADDRESS

        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(0x7e6b8b9510D71BF8EF0f893902EbB9C865eEF4Df); //KOVAN ADDRESS

        (, minRate) = _kyberNetworkProxy.getExpectedRate(ETH_TOKEN_ADDRESS, daiToken, _ethAmount);

        //will send back tokens to this contract's address
        uint destAmount = _kyberNetworkProxy.swapEtherToToken.value(_ethAmount)(daiToken, minRate);

        return destAmount;
    }

    function maxFreeCollateral(TubInterface _tub, address _vox, bytes32 _cdpID) public returns (uint) {
        return sub(_tub.ink(_cdpID), wdiv(wmul(wmul(_tub.tab(_cdpID), rmul(_tub.mat(), WAD)), IVox(_vox).par()), _tub.tag()));
    }


}
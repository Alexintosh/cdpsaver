pragma solidity ^0.5.0;

import "./interfaces/TubInterface.sol";
import "./interfaces/ERC20.sol";
import "./interfaces/KyberNetworkProxyInterface.sol";
import "./interfaces/ProxyRegistryInterface.sol";
import "./SaiProxy.sol";

contract IVox {
    function par() public returns (uint); //ref per dai
}

contract SaverProxy is SaiProxy {
    
    event Repay(address indexed owner, uint collateralAmount, uint daiAmount);
    event Boost(address indexed owner, uint daiAmount, uint collateralAmount);
    
    //KOVAN
    address constant ETHER_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address constant WETH_ADDRESS = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    address constant DAI_ADDRESS = 0xC4375B7De8af5a38a93548eb8453a498222C4fF2;
    address constant KYBER_INTERFACE = 0x7e6b8b9510D71BF8EF0f893902EbB9C865eEF4Df;
    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;
    address constant VOX_ADDRESS = 0xBb4339c0aB5B1d9f14Bd6e3426444A1e9d86A1d9;
    address constant REGISTRY_ADDRESS = 0x64A436ae831C1672AE81F674CAb8B6775df3475C;
    
    ///@dev User has to own MKR and aprrove the DSProxy address
    function repay(uint _cdpId) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);
        bytes32 cup = bytes32(_cdpId);

        uint maxCollateral = maxFreeCollateral(tub, VOX_ADDRESS, cup);

        free(address(tub), cup, maxCollateral, true);

        //TODO: don't use contract balance 
        uint daiAmount = swapEtherToToken(address(this).balance, DAI_ADDRESS);
        
        //TODO: check so we don't spend more dai than there is debt
        wipe(address(tub), cup, daiAmount, true);

        emit Repay(msg.sender, maxCollateral, daiAmount);
    }

    function boost(uint _cdpId) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);
        bytes32 cup = bytes32(_cdpId);
        
        uint maxDai = maxFreeDai(tub, cup);
        
        tub.draw(cup, maxDai);
        
        uint ethAmount = lockPeth(tub, cup, maxDai);
        
        emit Boost(msg.sender, maxDai, ethAmount);
    }

    function createCdp(uint _daiAmount) public payable returns (address proxy, bytes32 cup) {
        proxy = ProxyRegistryInterface(REGISTRY_ADDRESS).build(msg.sender);
        cup = open(TUB_ADDRESS);
        lockAndDraw(TUB_ADDRESS, cup, _daiAmount);
        TubInterface(TUB_ADDRESS).give(cup, proxy);
    }

    function maxFreeCollateral(TubInterface _tub, address _vox, bytes32 _cdpId) public returns (uint) {
        return sub(_tub.ink(_cdpId), wdiv(wmul(wmul(_tub.tab(_cdpId), rmul(_tub.mat(), WAD)), IVox(_vox).par()), _tub.tag()));
    }
    
    function maxFreeDai(TubInterface _tub, bytes32 _cdpId) public returns (uint) {
        return sub(wdiv(rmul(_tub.ink(_cdpId), _tub.tag()), rmul(_tub.mat(), WAD)), _tub.tab(_cdpId));
    }

    function getRatio(TubInterface _tub, bytes32 _cdpId) public returns(uint) {
        return (wdiv(rmul(rmul(_tub.ink(_cdpId), _tub.tag()), WAD), _tub.tab(_cdpId)))/10000000;
    }
    
    function lockPeth(TubInterface _tub, bytes32 cup, uint maxDai) internal returns(uint) {
        uint ethAmount = swapTokenToEther(DAI_ADDRESS, maxDai);
        
        _tub.gem().deposit.value(ethAmount)();

        uint ink = rdiv(ethAmount, _tub.per());
        if (_tub.gem().allowance(address(this), address(_tub)) != uint(-1)) {
            _tub.gem().approve(address(_tub), uint(-1));
        }
        _tub.join(ink);

        if (_tub.skr().allowance(address(this), address(_tub)) != uint(-1)) {
            _tub.skr().approve(address(_tub), uint(-1));
        }
        _tub.lock(cup, ink);
        
        return ethAmount;
    }

    function payStabilityFee() internal {
        
    }
    
    // KYBER

    //TODO: watch out for gas price limits
    function swapEtherToToken (uint _ethAmount, address _tokenAddress) internal returns(uint) {

        uint minRate;
        ERC20 ETH_TOKEN_ADDRESS = ERC20(ETHER_ADDRESS);
        ERC20 token = ERC20(_tokenAddress);

        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);

        (, minRate) = _kyberNetworkProxy.getExpectedRate(ETH_TOKEN_ADDRESS, token, _ethAmount);

        //will send back tokens to this contract's address
        uint destAmount = _kyberNetworkProxy.swapEtherToToken.value(_ethAmount)(token, minRate);

        return destAmount;
    }
    
    function swapTokenToEther (address _tokenAddress, uint _amount) internal returns(uint) {

        uint minRate;
        ERC20 ETH_TOKEN_ADDRESS = ERC20(ETHER_ADDRESS);
        ERC20 token = ERC20(_tokenAddress);
        
        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);
        
        (, minRate) = _kyberNetworkProxy.getExpectedRate(token, ETH_TOKEN_ADDRESS, _amount);

        // Mitigate ERC20 Approve front-running attack, by initially setting, allowance to 0
        require(token.approve(address(_kyberNetworkProxy), 0));

        // Approve tokens so network can take them during the swap
        token.approve(address(_kyberNetworkProxy), _amount);
        uint destAmount = _kyberNetworkProxy.swapTokenToEther(token, _amount, minRate);

        return destAmount;
    }

}

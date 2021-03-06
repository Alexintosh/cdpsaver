pragma solidity 0.5.0;

import "./interfaces/ERC20.sol";
import "./interfaces/KyberNetworkProxyInterface.sol";
import "./interfaces/ExchangeInterface.sol";

contract KyberWrapper is ExchangeInterface {

    // Kovan
    address constant KYBER_INTERFACE = 0x692f391bCc85cefCe8C237C01e1f636BbD70EA4D;
    address constant ETHER_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    function swapEtherToToken (uint _ethAmount, address _tokenAddress) external payable returns(uint) {
        uint minRate;
        ERC20 ETH_TOKEN_ADDRESS = ERC20(ETHER_ADDRESS);
        ERC20 token = ERC20(_tokenAddress);

        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);

        (, minRate) = _kyberNetworkProxy.getExpectedRate(ETH_TOKEN_ADDRESS, token, _ethAmount);

        //will send back tokens to this contract's address
        uint destAmount = _kyberNetworkProxy.swapEtherToToken.value(_ethAmount)(token, minRate);

        token.transfer(msg.sender, destAmount);

        return destAmount;
    }
    
    function swapTokenToEther (address _tokenAddress, uint _amount) external returns(uint) {
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

        msg.sender.transfer(destAmount);

        return destAmount;
    }

    function swapTokenToToken (address _srcAddr, address _destAddr, uint srcQty) external returns(uint) {
        uint minRate;
        ERC20 srcToken = ERC20(_srcAddr);
        ERC20 destToken = ERC20(_destAddr);

        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);

        (, minRate) = _kyberNetworkProxy.getExpectedRate(srcToken, destToken, srcQty);

        require(srcToken.approve(address(_kyberNetworkProxy), 0));

        // Approve tokens so network can take them during the swap
        srcToken.approve(address(_kyberNetworkProxy), srcQty);
        uint destAmount = _kyberNetworkProxy.swapTokenToToken(srcToken, srcQty, destToken, minRate);

        destToken.transfer(msg.sender, destAmount);

        return destAmount;
    }

    function getExpectedRate(address _src, address _dest, uint _srcQty) public returns (uint, uint) {
        return KyberNetworkProxyInterface(KYBER_INTERFACE).getExpectedRate(ERC20(_src), ERC20(_dest), _srcQty);
    }

    function() payable external {
    }
}
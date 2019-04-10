pragma solidity 0.5.0;

import "./ERC20.sol";

//TODO: currenlty only adjusted to kyber, but should be genric interfaces for more dec. exchanges
interface ExchangeInterface {
    function swapEtherToToken (uint _ethAmount, address _tokenAddress) payable external returns(uint);
    function swapTokenToEther (address _tokenAddress, uint _amount) external returns(uint);
    function swapTokenToToken (address _srcAddr, address _destAddr, uint srcQty) external returns(uint);

    function getExpectedRate(address src, address dest, uint srcQty) external
        returns (uint expectedRate, uint slippageRate);
}
pragma solidity ^0.5.0;

contract OtcInterface {
    function getPayAmount(address, address, uint) public view returns (uint);
    function buyAllAmount(address, uint, address pay_gem, uint) public returns (uint);
}
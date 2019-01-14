pragma solidity ^0.5.0;

import "../DS/DSProxy.sol";

contract ProxyRegistryInterface {
    function proxies(address _owner) public view returns(DSProxy);
    function build(address) public returns (address);
}
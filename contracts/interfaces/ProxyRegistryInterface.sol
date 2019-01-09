pragma solidity ^0.5.0;

contract ProxyRegistryInterface {
    function proxies(address _owner) public view returns(address);
}
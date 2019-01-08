pragma solidity ^0.5.0;

import "./DS/DSAuthority.sol";

contract SaverAuthority is DSAuthority {

    //TODO: implement logic on who is allowed to call
    function canCall(address src, address dst, bytes4 sig) public view returns (bool) {
        return true;
    }
}
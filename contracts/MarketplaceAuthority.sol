pragma solidity ^0.5.0;

import "./DS/DSAuthority.sol";

contract MarkerplaceAuthority is DSAuthority {
    address public marketplace;

    constructor(address _marketplace) public {
        marketplace = _marketplace;
    }

    //TODO: additional check for sig?
    function canCall(address src, address dst, bytes4 sig) public view returns (bool) {
        if (src == marketplace) {
            return true;
        } else {
            return false;
        }
    }
}
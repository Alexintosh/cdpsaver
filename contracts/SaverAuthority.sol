pragma solidity 0.5.0;

import "./DS/DSAuthority.sol";

contract SaverAuthority is DSAuthority {
    address public monitor;

    constructor(address _monitor) public {
        monitor = _monitor;
    }

    ///@notice Access modifier, giving permission to Monitor contract to call DSProxy
    ///@param src From which address did the call come from, must be monitor address
    ///@param dst Always set to the address of the DSProxy itself
    ///@param sig Signature of the function call we can execute
    //TODO: additional check for sig?
    function canCall(address src, address dst, bytes4 sig) public view returns (bool) {
        if (src == monitor) {
            return true;
        } else {
            return false;
        }
    }
}
pragma solidity ^0.5.0;

import "./interfaces/TubInterface.sol";
import "./interfaces/ProxyRegistryInterface.sol";
import "./interfaces/ExchangeInterface.sol";
import "./interfaces/SaiProxyInterface.sol";
import "./DS/DSMath.sol";

contract IVox {
    function par() public returns (uint); //ref per dai
}

contract SaverProxy is DSMath {
    
    event Repay(address indexed owner, uint collateralAmount, uint daiAmount);
    event Boost(address indexed owner, uint daiAmount, uint collateralAmount);
    
    //KOVAN
    address constant WETH_ADDRESS = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    address constant DAI_ADDRESS = 0xC4375B7De8af5a38a93548eb8453a498222C4fF2;
    address constant MKR_ADDRESS = 0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD;
    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;
    address constant VOX_ADDRESS = 0xBb4339c0aB5B1d9f14Bd6e3426444A1e9d86A1d9;
    address constant REGISTRY_ADDRESS = 0x64A436ae831C1672AE81F674CAb8B6775df3475C;
    address constant SAI_PROXY = 0xADB7c74bCe932fC6C27ddA3Ac2344707d2fBb0E6;
    
    ///@dev User has to own MKR and aprrove the DSProxy address
    function repay(uint _cdpId, address _wrapperAddress) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);
        bytes32 cup = bytes32(_cdpId);

        //TODO: check so we don't get more eth than need to repay debt
        uint maxCollateral = maxFreeCollateral(tub, VOX_ADDRESS, cup);

        free(address(tub), cup, maxCollateral);

        uint daiAmount = ExchangeInterface(_wrapperAddress).swapEtherToToken.
                            value(maxCollateral)(maxCollateral, DAI_ADDRESS);
        
        uint fee = payStabilityFee(tub, _wrapperAddress, cup, daiAmount);
        daiAmount -= fee;

        wipe(address(tub), cup, daiAmount);

        emit Repay(msg.sender, maxCollateral, daiAmount);
    }

    function boost(uint _cdpId, address _wrapperAddress) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);
        bytes32 cup = bytes32(_cdpId);
        
        uint maxDai = maxFreeDai(tub, cup);
        
        tub.draw(cup, maxDai);
        
        uint ethAmount = lockPeth(tub, cup, maxDai, _wrapperAddress);
        
        emit Boost(msg.sender, maxDai, ethAmount);
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
    
    function lockPeth(TubInterface _tub, bytes32 cup, uint maxDai, address _wrapperAddress) internal returns(uint) {
        uint ethAmount = ExchangeInterface(_wrapperAddress).swapTokenToEther(DAI_ADDRESS, maxDai);
        
        _tub.gem().deposit.value(ethAmount)();

        uint ink = rdiv(ethAmount, _tub.per());
        
        allowOnce(_tub, _tub.gem());

        _tub.join(ink);

        allowOnce(_tub, _tub.skr());

        _tub.lock(cup, ink);
        
        return ethAmount;
    }

    //TODO: precise calc. of the _daiRepay amount
    function payStabilityFee(TubInterface _tub, address _wrapperAddress, bytes32 _cup, uint _daiRepay) internal returns(uint) {
        bytes32 mkrPrice;
        bool ok;

        uint feeInDai = rmul(_daiRepay, rdiv(_tub.rap(_cup), _tub.tab(_cup)));

        (mkrPrice, ok) = _tub.pep().peek();

        uint govAmt = wdiv(feeInDai, uint(mkrPrice));

        ERC20(DAI_ADDRESS).transfer(_wrapperAddress, govAmt);

        uint mkrAmountInDai = ExchangeInterface(_wrapperAddress).swapTokenToToken(DAI_ADDRESS, MKR_ADDRESS, govAmt);

        return mkrAmountInDai;
    }

    // SaiProxy methods, small changes
    function free(address tub_, bytes32 cup, uint jam) internal {
        if (jam > 0) {
            TubInterface tub = TubInterface(tub_);
            uint ink = rdiv(jam, tub.per());
            tub.free(cup, ink);
            
            allowOnce(tub, tub.skr());

            tub.exit(ink);
            tub.gem().withdraw(jam);
        }
    }

    function wipe(address tub_, bytes32 cup, uint wad) internal {
        if (wad > 0) {
            TubInterface tub = TubInterface(tub_);

            allowOnce(tub, tub.sai());
           
            allowOnce(tub, tub.gov());
            tub.wipe(cup, wad);
        }
    }

    function allowOnce(TubInterface _tub, TokenInterface _token) internal {
        if (_token.allowance(address(this), address(_tub)) != uint(-1)) {
            _token.approve(address(_tub), uint(-1));
        }
    }
}

pragma solidity ^0.5.0;

import "./interfaces/TubInterface.sol";
import "./interfaces/ProxyRegistryInterface.sol";
import "./interfaces/SaiProxyInterface.sol";
import "./interfaces/ExchangeInterface.sol";
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
    address constant VOX_ADDRESS = 0xBb4339c0aB5B1d9f14Bd6e3426444A1e9d86A1d9;
    address constant REGISTRY_ADDRESS = 0x64A436ae831C1672AE81F674CAb8B6775df3475C;
    address constant SAI_PROXY = 0xADB7c74bCe932fC6C27ddA3Ac2344707d2fBb0E6;
    address constant PETH_ADDRESS = 0xf4d791139cE033Ad35DB2B2201435fAd668B1b64;

    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;
    
    constructor() public {
        ERC20(DAI_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        ERC20(MKR_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        ERC20(PETH_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        ERC20(WETH_ADDRESS).approve(TUB_ADDRESS, uint(-1));
    }

    ///@dev User has to own MKR and aprrove the DSProxy address
    //TODO: check so we don't get more eth than need to repay debt
    function repay(bytes32 _cup, bool _buyMkr, address _wrapper) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);

        uint maxCollateral = maxFreeCollateral(tub, VOX_ADDRESS, _cup);

        free(tub, _cup, maxCollateral);

        uint daiAmount = ExchangeInterface(_wrapper).swapEtherToToken.
                            value(maxCollateral)(maxCollateral, DAI_ADDRESS);
        
        if (_buyMkr) {
            // uint fee = payStabilityFee(tub, _cup, daiAmount);
            // daiAmount -= fee;
        } else {
            uint mkrAmount = feeInMkr(tub, _cup, daiAmount);
            ERC20(MKR_ADDRESS).transferFrom(msg.sender, address(this), mkrAmount);
        }

        tub.wipe(_cup, daiAmount);

        emit Repay(msg.sender, maxCollateral, daiAmount);
    }

    function boost(bytes32 _cup, address _wrapper) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);
        
        uint maxDai = maxFreeDai(tub, _cup);
        
        tub.draw(_cup, maxDai);
        
        uint ethAmount = lockPeth(tub, _cup, maxDai, _wrapper);
        
        emit Boost(msg.sender, maxDai, ethAmount);
    }


    // around 50k gas cost
    function maxFreeCollateral(TubInterface _tub, address _vox, bytes32 _cup) public returns (uint) {
        return sub(_tub.ink(_cup), wdiv(wmul(wmul(_tub.tab(_cup), rmul(_tub.mat(), WAD)), IVox(_vox).par()), _tub.tag()));
    }
    
    function maxFreeDai(TubInterface _tub, bytes32 _cdpId) public returns (uint) {
        return (sub(wdiv(rmul(_tub.ink(_cdpId), _tub.tag()), rmul(_tub.mat(), WAD)), _tub.tab(_cdpId))) - 1;
    }

    function getRatio(TubInterface _tub, bytes32 _cdpId) public returns(uint) {
        return (wdiv(rmul(rmul(_tub.ink(_cdpId), _tub.tag()), WAD), _tub.tab(_cdpId)))/10000000;
    }
    
    function lockPeth(TubInterface _tub, bytes32 cup, uint maxDai, address _wrapper) internal returns(uint) {
        ERC20(DAI_ADDRESS).transferFrom(address(this), _wrapper, maxDai);

        uint ethAmount = ExchangeInterface(_wrapper).swapTokenToEther(DAI_ADDRESS, maxDai);
        
        _tub.gem().deposit.value(ethAmount)();

        uint ink = rdiv(ethAmount, _tub.per());
        
        _tub.join(ink);

        _tub.lock(cup, ink);
        
        return ethAmount;
    }

    //TODO: precise calc. of the _daiRepay amount
    // function payStabilityFee(TubInterface _tub, bytes32 _cup, uint _daiRepay) internal returns(uint) {
    //     uint govAmt = feeInMkr(_tub, _cup, daiRepay)

    //     uint mkrAmountInDai = swapTokenToToken(DAI_ADDRESS, MKR_ADDRESS, feeInDai);

    //     return mkrAmountInDai;
    // }

    function feeInMkr(TubInterface _tub, bytes32 _cup, uint _daiRepay) public returns (uint) {
        bytes32 mkrPrice;
        bool ok;

        uint feeInDai = rmul(_daiRepay, rdiv(_tub.rap(_cup), _tub.tab(_cup)));

        (mkrPrice, ok) = _tub.pep().peek();

        return wdiv(feeInDai, uint(mkrPrice));
    }

    // // SaiProxy methods, small changes
    // arounc 120k gas cost
    function free(TubInterface tub, bytes32 cup, uint jam) internal {
        uint ink = rdiv(jam, tub.per());
        tub.free(cup, ink);
        
        tub.exit(ink);
        tub.gem().withdraw(jam);
    }
}

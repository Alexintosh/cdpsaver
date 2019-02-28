pragma solidity 0.5.0;

import "./interfaces/TubInterface.sol";
import "./interfaces/ExchangeInterface.sol";
import "./DS/DSMath.sol";

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

    address constant KYBER_WRAPPER = 0x6F95865D93eD781AddC7576901842ee3B689E0f1;

    address constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;
    
    constructor() public {
        ERC20(DAI_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        ERC20(MKR_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        ERC20(PETH_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        ERC20(WETH_ADDRESS).approve(TUB_ADDRESS, uint(-1));
    }

    ///@dev User has to own MKR and aprrove the DSProxy address
    function repay(bytes32 _cup, uint _amount, bool _buyMkr) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);

        uint startingRatio = getRatio(tub, _cup);

        if (_amount == 0) {
            _amount = maxFreeCollateral(tub, _cup);
        }

        free(tub, _cup, _amount);

        uint daiAmount = rmul(_amount, uint(tub.pip().read())); //Amount of dai we can return

        if (_buyMkr) {
            uint ethFee = feeInEth(tub, _cup, daiAmount);
            ExchangeInterface(KYBER_WRAPPER).swapEtherToToken.
                            value(_amount)(_amount, MKR_ADDRESS);

            _amount -= ethFee;
        } else {
            uint mkrAmount = feeInMkr(tub, _cup, daiAmount);
            ERC20(MKR_ADDRESS).transferFrom(msg.sender, address(this), mkrAmount);
        }

        daiAmount = ExchangeInterface(KYBER_WRAPPER).swapEtherToToken.
                            value(_amount)(_amount, DAI_ADDRESS);
        

        tub.wipe(_cup, daiAmount);

        require(getRatio(tub, _cup) > startingRatio, "ratio must be better off at the end");

        emit Repay(msg.sender, _amount, daiAmount);
    }

    function boost(bytes32 _cup, uint _amount) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);
        
        if (_amount == 0) {
            _amount = maxFreeDai(tub, _cup);
        }

        uint startingCollateral = tub.ink(_cup);
        
        tub.draw(_cup, _amount);
        
        uint ethAmount = lockPeth(tub, _cup, _amount);

        require(tub.ink(_cup) > startingCollateral, "collateral must be bigger than starting point");
        
        emit Boost(msg.sender, _amount, ethAmount);
    }

    function maxFreeCollateral(TubInterface _tub, bytes32 _cup) public returns (uint) {
        return sub(_tub.ink(_cup), wdiv(wmul(wmul(_tub.tab(_cup), rmul(_tub.mat(), WAD)),
                VoxInterface(VOX_ADDRESS).par()), _tub.tag()));
    }
    
    function maxFreeDai(TubInterface _tub, bytes32 _cdpId) public returns (uint) {
        return (sub(wdiv(rmul(_tub.ink(_cdpId), _tub.tag()), rmul(_tub.mat(), WAD)), _tub.tab(_cdpId))) - 1;
    }
    
    function lockPeth(TubInterface _tub, bytes32 cup, uint maxDai) internal returns(uint) {
        ERC20(DAI_ADDRESS).transferFrom(address(this), KYBER_WRAPPER, maxDai);

        uint ethAmount = ExchangeInterface(KYBER_WRAPPER).swapTokenToEther(DAI_ADDRESS, maxDai);
        
        _tub.gem().deposit.value(ethAmount)();

        uint ink = rdiv(ethAmount, _tub.per());
        
        _tub.join(ink);

        _tub.lock(cup, ink);
        
        return ethAmount;
    }

    function payStabilityFee(TubInterface _tub, bytes32 _cup, uint _daiRepay) internal returns(uint) {
        uint feeInDai = rmul(_daiRepay, rdiv(_tub.rap(_cup), _tub.tab(_cup)));

        uint mkrAmountInDai = ExchangeInterface(KYBER_WRAPPER).swapTokenToToken(DAI_ADDRESS, MKR_ADDRESS, feeInDai);

        return mkrAmountInDai;
    }

    function feeInMkr(TubInterface _tub, bytes32 _cup, uint _daiRepay) public returns (uint) {
        uint feeInDai = rmul(_daiRepay, rdiv(_tub.rap(_cup), _tub.tab(_cup)));

        bytes32 ethPrice = _tub.pip().read();

        return wdiv(feeInDai, uint(ethPrice));
    }

    function feeInEth(TubInterface _tub, bytes32 _cup, uint _daiRepay) public returns (uint) {
        bytes32 mkrPrice;
        bool ok;

        uint feeInDai = rmul(_daiRepay, rdiv(_tub.rap(_cup), _tub.tab(_cup)));

        (mkrPrice, ok) = _tub.pep().peek();

        return wdiv(feeInDai, uint(mkrPrice));
    }

    function getRatio(TubInterface _tub, bytes32 _cup) internal returns(uint) {
        return (wdiv(rmul(rmul(_tub.ink(_cup), _tub.tag()), WAD), _tub.tab(_cup)));
    }

    function free(TubInterface tub, bytes32 cup, uint jam) internal {
        uint ink = rdiv(jam, tub.per());
        tub.free(cup, ink);
        
        tub.exit(ink);
        tub.gem().withdraw(jam);
    }
}

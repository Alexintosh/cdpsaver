pragma solidity 0.5.0;

import "./interfaces/TubInterface.sol";
import "./interfaces/ExchangeInterface.sol";
import "./DS/DSMath.sol";

/// @title SaverProxy implements advanced dashboard features repay/boost
contract SaverProxy is DSMath {
    //KOVAN
    address public constant WETH_ADDRESS = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    address public constant DAI_ADDRESS = 0xC4375B7De8af5a38a93548eb8453a498222C4fF2;
    address public constant MKR_ADDRESS = 0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD;
    address public constant VOX_ADDRESS = 0xBb4339c0aB5B1d9f14Bd6e3426444A1e9d86A1d9;
    address public constant PETH_ADDRESS = 0xf4d791139cE033Ad35DB2B2201435fAd668B1b64;
    address public constant KYBER_WRAPPER = 0x82CD6436c58A65E2D4263259EcA5843d3d7e0e65;
    address public constant TUB_ADDRESS = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;
    address public constant ETHER_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    event Repay(address indexed owner, uint collateralAmount, uint daiAmount);
    event Boost(address indexed owner, uint daiAmount, uint collateralAmount);

    /// @notice Withdraws Eth collateral, swaps Eth -> Dai with Kyber, and pays back the debt in Dai
    /// @dev If _buyMkr is false user needs to have MKR tokens and approve his DSProxy
    /// @param _cup Id of the CDP
    /// @param _amount Amount of Eth to sell, if the value is 0 it will take the max. avaialable amount
    /// @param _buyMkr If true it will convert ETH -> MKR to pay stability fee, if false it will take MKR from user
    /// @param _userAddr The address of the user who called the function, so we can send extra Dai to user
    function repay(bytes32 _cup, uint _amount, bool _buyMkr, address _userAddr) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);

        approveTub(DAI_ADDRESS);
        approveTub(MKR_ADDRESS);
        approveTub(PETH_ADDRESS);
        approveTub(WETH_ADDRESS);

        uint startingRatio = getRatio(tub, _cup);

        if (_amount == 0) {
            _amount = maxFreeCollateral(tub, _cup);
        }

        withdrawEth(tub, _cup, _amount);

        uint daiAmount = wmul(_amount, estimatedDaiPrice(_amount));
        uint daiDebt = daiAmount > getDebt(tub, _cup) ? getDebt(tub, _cup) : daiAmount;

        if (_buyMkr) {
            uint ethFee = stabilityFeeInEth(tub, _cup, daiDebt);
            ExchangeInterface(KYBER_WRAPPER).swapEtherToToken.
                            value(ethFee)(ethFee, MKR_ADDRESS);

            _amount = sub(_amount, ethFee);
        } else {
            uint mkrAmount = stabilityFeeInMkr(tub, _cup, daiDebt);
            ERC20(MKR_ADDRESS).transferFrom(msg.sender, address(this), mkrAmount);
        }

        daiAmount = ExchangeInterface(KYBER_WRAPPER).swapEtherToToken.
                            value(_amount)(_amount, DAI_ADDRESS);
        
        if (daiAmount > daiDebt) {
            tub.wipe(_cup, daiDebt);
            ERC20(DAI_ADDRESS).transfer(_userAddr, sub(daiAmount, daiDebt));
        } else {
            tub.wipe(_cup, daiAmount);
            require(getRatio(tub, _cup) > startingRatio, "ratio must be better off at the end");

        }

        emit Repay(msg.sender, _amount, daiAmount);
    }

    /// @notice Boost will draw Dai, swap Dai -> Eth on kyber, and add that Eth to the CDP
    /// @dev Amount must be less then the max. amount available Dai to generate
    /// @param _cup Id of the CDP
    /// @param _amount Amount of Dai to sell, if the value is 0 it will take the max. avaialable amount 
    function boost(bytes32 _cup, uint _amount) public {
        TubInterface tub = TubInterface(TUB_ADDRESS);

        ERC20(WETH_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        ERC20(PETH_ADDRESS).approve(TUB_ADDRESS, uint(-1));
        
        if (_amount == 0) {
            _amount = maxFreeDai(tub, _cup);
        }

        uint startingCollateral = tub.ink(_cup);
        
        tub.draw(_cup, _amount);
        
        uint ethAmount = swapDaiAndLockEth(tub, _cup, _amount);

        require(tub.ink(_cup) > startingCollateral, "collateral must be bigger than starting point");
        
        emit Boost(msg.sender, _amount, ethAmount);
    }

    /// @notice Max. amount of collateral available to withdraw
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    function maxFreeCollateral(TubInterface _tub, bytes32 _cup) public returns (uint) {
        return sub(_tub.ink(_cup), wdiv(wmul(wmul(_tub.tab(_cup), rmul(_tub.mat(), WAD)),
                VoxInterface(VOX_ADDRESS).par()), _tub.tag()));
    }
    
    /// @notice Max. amount of Dai available to generate
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    function maxFreeDai(TubInterface _tub, bytes32 _cup) public returns (uint) {
        return sub(wdiv(rmul(_tub.ink(_cup), _tub.tag()), rmul(_tub.mat(), WAD)), _tub.tab(_cup));
    }

    /// @notice Stability fee amount in Eth
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    /// @param _daiRepay Amount of dai we are repaying
    function stabilityFeeInEth(TubInterface _tub, bytes32 _cup, uint _daiRepay) public returns (uint) {
        uint feeInDai = rmul(_daiRepay, rdiv(_tub.rap(_cup), _tub.tab(_cup)));

        bytes32 ethPrice = _tub.pip().read();

        return wdiv(feeInDai, uint(ethPrice));
    }

    /// @notice Stability fee amount in Mkr
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    /// @param _daiRepay Amount of dai we are repaying
    function stabilityFeeInMkr(TubInterface _tub, bytes32 _cup, uint _daiRepay) public returns (uint) {
        bytes32 mkrPrice;
        bool ok;

        uint feeInDai = rmul(_daiRepay, rdiv(_tub.rap(_cup), _tub.tab(_cup)));

        (mkrPrice, ok) = _tub.pep().peek();

        return wdiv(feeInDai, uint(mkrPrice));
    }
    
    /// @notice Helper function which swaps Dai for Eth and adds the collateral to the CDP
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    /// @param _daiAmount Amount of Dai to swap for Eth
    function swapDaiAndLockEth(TubInterface _tub, bytes32 _cup, uint _daiAmount) internal returns(uint) {
        ERC20(DAI_ADDRESS).transferFrom(address(this), KYBER_WRAPPER, _daiAmount);

        uint ethAmount = ExchangeInterface(KYBER_WRAPPER).swapTokenToEther(DAI_ADDRESS, _daiAmount);
        
        _tub.gem().deposit.value(ethAmount)();

        uint ink = rdiv(ethAmount, _tub.per());
        
        _tub.join(ink);

        _tub.lock(_cup, ink);
        
        return ethAmount;
    }

    /// @notice Approve a token if it's not already approved
    /// @param _tokenAddress Address of the ERC20 token we want to approve
    function approveTub(address _tokenAddress) internal {
        if (ERC20(_tokenAddress).allowance(msg.sender, _tokenAddress) != uint(-1)) {
            ERC20(_tokenAddress).approve(TUB_ADDRESS, uint(-1));
        }
    }

    /// @notice Returns the current collaterlization ratio for the CDP
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    function getRatio(TubInterface _tub, bytes32 _cup) internal returns(uint) {
        return (wdiv(rmul(rmul(_tub.ink(_cup), _tub.tag()), WAD), _tub.tab(_cup)));
    }

    /// @notice Helper function which withdraws collateral from CDP
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    /// @param _ethAmount Amount of Eth to withdraw
    function withdrawEth(TubInterface _tub, bytes32 _cup, uint _ethAmount) internal {
        uint ink = rdiv(_ethAmount, _tub.per());
        _tub.free(_cup, ink);
        
        _tub.exit(ink);
        _tub.gem().withdraw(_ethAmount);
    }

    /// @notice Returns expected rate for Eth -> Dai conversion
    /// @param _amount Amount of Ether
    function estimatedDaiPrice(uint _amount) internal returns (uint expectedRate) {
        (expectedRate, ) = ExchangeInterface(KYBER_WRAPPER).getExpectedRate(ETHER_ADDRESS, DAI_ADDRESS, _amount);
    }

    /// @notice Returns current Dai debt of the CDP
    /// @param _tub Tub interface
    /// @param _cup Id of the CDP
    function getDebt(TubInterface _tub, bytes32 _cup) internal returns (uint debt) {
        ( , , debt, ) = _tub.cups(_cup);
    }
}

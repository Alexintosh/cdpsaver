import {
  GENERATE_DAI_REQUEST,
  GENERATE_DAI_SUCCESS,
  GENERATE_DAI_FAILURE,

  GET_MAX_DAI_REQUEST,
  GET_MAX_DAI_SUCCESS,
  GET_MAX_DAI_FAILURE,

  WITHDRAW_ETH_REQUEST,
  WITHDRAW_ETH_SUCCESS,
  WITHDRAW_ETH_FAILURE,

  GET_MAX_ETH_WITHDRAW_REQUEST,
  GET_MAX_ETH_WITHDRAW_SUCCESS,
  GET_MAX_ETH_WITHDRAW_FAILURE,

  REPAY_DAI_REQUEST,
  REPAY_DAI_SUCCESS,
  REPAY_DAI_FAILURE,

  ADD_COLLATERAL_REQUEST,
  ADD_COLLATERAL_SUCCESS,
  ADD_COLLATERAL_FAILURE,

  GET_AFTER_CDP_REQUEST,
  GET_AFTER_CDP_SUCCESS,
  GET_AFTER_CDP_FAILURE,

  APPROVE_DAI_REQUEST,
  APPROVE_DAI_SUCCESS,
  APPROVE_DAI_FAILURE,

  APPROVE_MAKER_REQUEST,
  APPROVE_MAKER_SUCCESS,
  APPROVE_MAKER_FAILURE,

  TRANSFER_CDP_REQUEST,
  TRANSFER_CDP_SUCCESS,
  TRANSFER_CDP_FAILURE,

  PAYBACK_DAI_REQUEST,
  PAYBACK_DAI_SUCCESS,
  PAYBACK_DAI_FAILURE,

  GET_REPAY_MODAL_DATA_REQUEST,
  GET_REPAY_MODAL_DATA_SUCCESS,
  GET_REPAY_MODAL_DATA_FAILURE,
  RESET_REPAY_MODAL,

  GET_BOOST_MODAL_DATA_REQUEST,
  GET_BOOST_MODAL_DATA_SUCCESS,
  GET_BOOST_MODAL_DATA_FAILURE,
  RESET_BOOST_MODAL,

  BOOST_REQUEST,
  BOOST_SUCCESS,
  BOOST_FAILURE,
} from '../actionTypes/dashboardActionTypes';

const INITIAL_STATE = {
  generatingDai: false,
  generatingDaiError: '',

  maxDai: 0,
  gettingMaxDai: false,
  gettingMaxDaiError: '',

  withdrawingEth: false,
  withdrawingEthError: '',

  maxEthWithdraw: 0,
  gettingMaxEthWithdraw: false,
  gettingMaxEthWithdrawError: '',

  addingCollateral: false,
  addingCollateralError: '',

  payingBackDai: false,
  payingBackDaiError: '',

  repayingDai: false,
  repayingDaiError: '',

  repayStabilityFee: 0,
  repayDaiAmount: 0,
  repayExchangeRate: 0,
  gettingRepayModalData: false,
  gettingRepayModalDataError: '',

  afterType: '',
  afterCdp: null,
  gettingAfterCdp: false,
  gettingAfterCdpFailure: '',

  boosting: false,
  boostingError: '',

  boostEthAmount: 0,
  boostExchangeRate: 0,
  gettingBoostModalData: false,
  gettingBoostModalDataError: '',

  approvingDai: false,
  approvingDaiError: '',

  approvingMaker: false,
  approvingMakerError: '',

  transferringCdp: false,
  transferringCdpError: '',
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case GENERATE_DAI_REQUEST:
      return { ...state, generatingDai: true };

    case GENERATE_DAI_SUCCESS:
      return {
        ...state,
        generatingDai: false,
        generatingDaiError: '',
      };

    case GENERATE_DAI_FAILURE:
      return {
        ...state,
        generatingDai: false,
        generatingDaiError: payload,
      };

    case GET_MAX_DAI_REQUEST:
      return { ...state, gettingMaxDai: true };

    case GET_MAX_DAI_SUCCESS:
      return {
        ...state,
        gettingMaxDai: false,
        gettingMaxDaiError: '',
        maxDai: payload,
      };

    case GET_MAX_DAI_FAILURE:
      return {
        ...state,
        gettingMaxDai: false,
        gettingMaxDaiError: payload,
      };

    case WITHDRAW_ETH_REQUEST:
      return { ...state, withdrawingEth: true };

    case WITHDRAW_ETH_SUCCESS:
      return {
        ...state,
        withdrawingEth: false,
        withdrawingEthError: '',
      };

    case WITHDRAW_ETH_FAILURE:
      return {
        ...state,
        withdrawingEth: false,
        withdrawingEthError: payload,
      };

    case REPAY_DAI_REQUEST:
      return { ...state, repayingDai: true, repayingDaiError: '' };

    case REPAY_DAI_SUCCESS:
      return {
        ...state,
        repayingDai: false,
        repayingDaiError: '',
      };

    case REPAY_DAI_FAILURE:
      return {
        ...state,
        repayingDai: false,
        repayingDaiError: payload,
      };

    case GET_MAX_ETH_WITHDRAW_REQUEST:
      return { ...state, gettingMaxEthWithdraw: true };

    case GET_MAX_ETH_WITHDRAW_SUCCESS:
      return {
        ...state,
        gettingMaxEthWithdraw: false,
        gettingMaxEthWithdrawError: '',
        maxEthWithdraw: payload,
      };

    case GET_MAX_ETH_WITHDRAW_FAILURE:
      return {
        ...state,
        gettingMaxEthWithdraw: false,
        gettingMaxEthWithdrawError: payload,
      };

    case ADD_COLLATERAL_REQUEST:
      return { ...state, addingCollateral: true };

    case ADD_COLLATERAL_SUCCESS:
      return {
        ...state,
        addingCollateral: false,
        addingCollateralError: '',
      };

    case ADD_COLLATERAL_FAILURE:
      return {
        ...state,
        addingCollateral: false,
        addingCollateralError: payload,
      };

    case PAYBACK_DAI_REQUEST:
      return { ...state, payingBackDai: true };

    case PAYBACK_DAI_SUCCESS:
      return {
        ...state,
        payingBackDai: false,
        payingBackDaiError: '',
      };

    case PAYBACK_DAI_FAILURE:
      return {
        ...state,
        payingBackDai: false,
        payingBackDaiError: payload,
      };

    case GET_AFTER_CDP_REQUEST:
      return { ...state, gettingAfterCdp: true };

    case GET_AFTER_CDP_SUCCESS:
      return {
        ...state,
        gettingAfterCdp: false,
        gettingAfterCdpError: '',
        ...payload,
      };

    case GET_AFTER_CDP_FAILURE:
      return {
        ...state,
        gettingAfterCdp: false,
        gettingAfterCdpError: payload,
      };

    case APPROVE_DAI_REQUEST:
      return { ...state, approvingDai: true };

    case APPROVE_DAI_SUCCESS:
      return {
        ...state,
        approvingDai: false,
        approvingDaiError: '',
      };

    case APPROVE_DAI_FAILURE:
      return {
        ...state,
        approvingDai: false,
        approvingDaiError: payload,
      };

    case APPROVE_MAKER_REQUEST:
      return { ...state, approvingMaker: true };

    case APPROVE_MAKER_SUCCESS:
      return {
        ...state,
        approvingMaker: false,
        approvingMakerError: '',
      };

    case APPROVE_MAKER_FAILURE:
      return {
        ...state,
        approvingMaker: false,
        approvingMakerError: payload,
      };

    case TRANSFER_CDP_REQUEST:
      return { ...state, transferringCdp: true };

    case TRANSFER_CDP_SUCCESS:
      return {
        ...state,
        transferringCdp: false,
        transferringCdpError: '',
      };

    case TRANSFER_CDP_FAILURE:
      return {
        ...state,
        transferringCdp: false,
        transferringCdpError: payload,
      };

    case GET_REPAY_MODAL_DATA_REQUEST:
      return {
        ...state,
        gettingRepayModalData: true,
        gettingRepayModalDataError: '',
      };

    case GET_REPAY_MODAL_DATA_SUCCESS:
      return {
        ...state,
        gettingRepayModalData: false,
        gettingRepayModalDataError: '',
        ...payload,
      };

    case GET_REPAY_MODAL_DATA_FAILURE:
      return {
        ...state,
        gettingRepayModalData: false,
        gettingRepayModalDataError: payload,
      };

    case RESET_REPAY_MODAL:
      return {
        ...state,
        repayingDai: false,
        repayingDaiError: '',
        repayStabilityFee: 0,
        gettingRepayModalData: false,
        gettingRepayModalDataError: '',
      };

    case BOOST_REQUEST:
      return { ...state, boosting: true, boostingError: '' };

    case BOOST_SUCCESS:
      return { ...state, boosting: false, boostingError: '' };

    case BOOST_FAILURE:
      return { ...state, boosting: false, boostingError: payload };

    case GET_BOOST_MODAL_DATA_REQUEST:
      return {
        ...state,
        gettingBoostModalData: true,
        gettingBoostModalDataError: '',
      };

    case GET_BOOST_MODAL_DATA_SUCCESS:
      return {
        ...state,
        gettingBoostModalData: false,
        gettingBoostModalDataError: '',
        ...payload,
      };

    case GET_BOOST_MODAL_DATA_FAILURE:
      return {
        ...state,
        gettingBoostModalData: false,
        gettingBoostModalDataError: payload,
      };

    case RESET_BOOST_MODAL:
      return {
        ...state,
        boosting: false,
        boostingError: '',
        boostEthAmount: 0,
        boostExchangeRate: 0,
        gettingBoostModalData: false,
        gettingBoostModalDataError: '',
      };


    default:
      return state;
  }
};

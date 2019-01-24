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

  afterType: '',
  afterCdp: null,
  gettingAfterCdp: false,
  gettingAfterCdpFailure: '',

  approvingDai: false,
  approvingDaiError: '',

  approvingMaker: false,
  approvingMakerError: '',
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

    default:
      return state;
  }
};

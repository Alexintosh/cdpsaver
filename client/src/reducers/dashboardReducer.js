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

    default:
      return state;
  }
};

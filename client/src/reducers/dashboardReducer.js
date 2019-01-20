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
} from '../actionTypes/dashboardActionTypes';

const INITIAL_STATE = {
  generatingDai: false,
  generatingDaiError: '',

  maxDai: 0,
  gettingMaxDai: false,
  gettingMaxDaiError: false,

  withdrawingEth: false,
  withdrawingEthError: '',
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

    default:
      return state;
  }
};

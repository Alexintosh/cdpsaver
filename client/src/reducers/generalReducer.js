import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,

  GET_CDP_REQUEST,
  GET_CDP_SUCCESS,
  GET_CDP_FAILURE,

  LOGIN_STARTED,
  LOGIN_FINISHED,

  GET_ETH_PRICE_REQUEST,
  GET_ETH_PRICE_SUCCESS,

  ADD_PROXY_ADDRESS,
} from '../actionTypes/generalActionTypes';
import { CREATE_CDP_SUCCESS } from '../actionTypes/onboardingActionTypes';
import { GENERATE_DAI_SUCCESS } from '../actionTypes/dashboardActionTypes';
import { LS_ACCOUNT } from '../constants/general';

const lsAccountType = JSON.parse(localStorage.getItem(LS_ACCOUNT));

const INITIAL_STATE = {
  loggingIn: false,

  cdp: null,
  gettingCdp: false,
  gettingCdpError: '',

  connectingProvider: false,

  account: '',
  accountError: '',
  accountType: lsAccountType ? lsAccountType.accountType : '',
  balance: 0,

  proxyAddress: '',

  ethPrice: 0,
  gettingEthPrice: false,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CDP_REQUEST:
      return { ...state, gettingCdp: true };

    case GET_CDP_SUCCESS:
      return {
        ...state,
        gettingCdp: false,
        gettingCdpError: '',
        cdp: payload,
      };

    case GET_CDP_FAILURE:
      return {
        ...state,
        gettingCdp: false,
        gettingCdpError: payload,
      };

    case CREATE_CDP_SUCCESS:
    case GENERATE_DAI_SUCCESS:
      return {
        ...state,
        cdp: {
          debtDai: payload.debtDai,
          depositedETH: payload.depositedETH,
          depositedPETH: payload.depositedPETH,
          depositedUSD: payload.depositedUSD,
          generatedDAI: payload.generatedDAI,
          id: payload.id,
          isSafe: payload.isSafe,
          liquidationPrice: payload.liquidationPrice,
          owner: payload.owner,
          ratio: payload.ratio,
          ...payload,
        },
      };

    case CONNECT_PROVIDER:
      return { ...state, connectingProvider: true };

    case CONNECT_PROVIDER_SUCCESS:
      return {
        ...state,
        connectingProvider: false,
        accountError: '',
        ...payload,
      };

    case CONNECT_PROVIDER_FAILURE:
      return {
        ...state,
        connectingProvider: false,
        account: '',
        accountType: '',
        balance: 0,
        accountError: payload,
      };

    case LOGIN_STARTED:
      return { ...state, loggingIn: true };

    case LOGIN_FINISHED:
      return { ...state, loggingIn: false };

    case ADD_PROXY_ADDRESS:
      return { ...state, proxyAddress: payload };

    case GET_ETH_PRICE_REQUEST:
      return { ...state, gettingEthPrice: true };

    case GET_ETH_PRICE_SUCCESS:
      return { ...state, gettingEthPrice: false, ethPrice: payload };

    default:
      return state;
  }
};

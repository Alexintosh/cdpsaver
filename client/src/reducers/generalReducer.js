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

  GET_CLOSE_DATA_REQUEST,
  GET_CLOSE_DATA_SUCCESS,
  GET_CLOSE_DATA_FAILURE,
} from '../actionTypes/generalActionTypes';
import { CREATE_CDP_SUCCESS } from '../actionTypes/onboardingActionTypes';
import {
  ADD_COLLATERAL_SUCCESS,
  APPROVE_DAI_SUCCESS,
  APPROVE_MAKER_SUCCESS,
  GENERATE_DAI_SUCCESS,
  TRANSFER_CDP_SUCCESS,
  WITHDRAW_ETH_SUCCESS,
  REPAY_DAI_SUCCESS,
  PAYBACK_DAI_SUCCESS,
} from '../actionTypes/dashboardActionTypes';
import { LS_ACCOUNT } from '../constants/general';
import { CANCEL_SELL_CDP_SUCCESS, SELL_CDP_SUCCESS } from '../actionTypes/marketplaceActionTypes';

const lsAccountType = localStorage.getItem(LS_ACCOUNT);

const INITIAL_STATE = {
  loggingIn: false,

  cdp: null,
  gettingCdp: false,
  gettingCdpError: '',

  connectingProvider: false,

  account: '',
  accountError: '',
  accountType: lsAccountType || '',
  balance: 0,
  network: 0,

  proxyAddress: '',

  ethPrice: 0,
  gettingEthPrice: false,

  daiBalance: 0,
  makerBalance: 0,
  enoughMkrToWipe: false,
  daiUnlocked: false,
  makerUnlocked: false,
  enoughEthToWipe: false,
  gettingCloseData: false,
  gettingCloseDataError: '',
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
    case WITHDRAW_ETH_SUCCESS:
    case ADD_COLLATERAL_SUCCESS:
    case REPAY_DAI_SUCCESS:
    case SELL_CDP_SUCCESS:
    case PAYBACK_DAI_SUCCESS:
    case CANCEL_SELL_CDP_SUCCESS:
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
          cdpInstance: payload.cdpInstance,
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

    case GET_CLOSE_DATA_REQUEST:
      return { ...state, gettingCloseData: true };

    case GET_CLOSE_DATA_SUCCESS:
      return {
        ...state,
        gettingCloseData: false,
        gettingCloseDataError: '',
        ...payload,
      };

    case GET_CLOSE_DATA_FAILURE:
      return {
        ...state,
        gettingCloseData: false,
        gettingCloseDataError: payload,
      };

    case APPROVE_DAI_SUCCESS:
      return { ...state, daiUnlocked: true };

    case APPROVE_MAKER_SUCCESS:
      return { ...state, makerUnlocked: true };

    case TRANSFER_CDP_SUCCESS:
      return { ...state, cdp: null, proxyAddress: '' };

    default:
      return state;
  }
};

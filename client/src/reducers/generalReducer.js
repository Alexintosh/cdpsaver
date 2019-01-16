import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,

  GET_CDP_REQUEST,
  GET_CDP_SUCCESS,
  GET_CDP_FAILURE,

  LOGIN_STARTED,
  LOGIN_FINISHED,
} from '../actionTypes/generalActionTypes';
import { CREATE_CDP_SUCCESS } from '../actionTypes/onboardingActionTypes';
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
      return { ...state, cdp: payload };

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

    default:
      return state;
  }
};

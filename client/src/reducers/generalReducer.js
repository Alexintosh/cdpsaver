import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,

  ADD_CDP,
} from '../actionTypes/generalActionTypes';
import { CREATE_CDP_SUCCESS } from '../actionTypes/onboardingActionTypes';
import { LS_ACCOUNT } from '../constants/general';

const lsAccountType = JSON.parse(localStorage.getItem(LS_ACCOUNT));

const INITIAL_STATE = {
  cdp: null,

  connectingProvider: false,

  account: '',
  accountError: '',
  accountType: lsAccountType ? lsAccountType.accountType : '',
  balance: 0,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CDP_SUCCESS:
    case ADD_CDP:
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

    default:
      return state;
  }
};

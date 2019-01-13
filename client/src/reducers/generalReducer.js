import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,
} from '../actionTypes/generalActionTypes';
import { CREATE_CDP_SUCCESS } from '../actionTypes/onboardingActionTypes';
import { LS_ACCOUNT } from '../constants/general';

const MOCK_CDP = {
  id: 3613,
  owner: '0xB4cE4f46a567e794b91DE27BCc5a9D6A37AaB1c3',
  depositedPETH: 5820083806803827794,
  generatedDAI: 271015737916404574032,
  depositedETH: 6.054011114131279224655322198571386,
  depositedUSD: 870.93003887892582925891465148647958996,
  liquidationPrice: 67.14946491024752541585,
  debtDai: 271.02,
  isSafe: true,
  ratio: 3.2135773574432274,
};

const lsAccountType = JSON.parse(localStorage.getItem(LS_ACCOUNT));

const INITIAL_STATE = {
  cdp: MOCK_CDP,

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

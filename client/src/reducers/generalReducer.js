import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,

  GET_CDP_REQUEST,
  GET_CDP_SUCCESS,
  GET_CDP_FAILURE,

  GET_CDPS_SUCCESS,

  SWITCH_CDP,

  LOGIN_STARTED,
  LOGIN_FINISHED,

  GET_ETH_PRICE_REQUEST,
  GET_ETH_PRICE_SUCCESS,

  ADD_PROXY_ADDRESS,

  GET_CLOSE_DATA_REQUEST,
  GET_CLOSE_DATA_SUCCESS,
  GET_CLOSE_DATA_FAILURE,

  SUBSCRIBE_COMING_SOON_REQUEST,
  SUBSCRIBE_COMING_SOON_SUCCESS,
  SUBSCRIBE_COMING_SOON_FAILURE,
  RESET_SUBSCRIBE_COMING_SOON,

  CDP_IN_CDPS_CHANGED,

  SUBMIT_CONTACT_US_REQUEST,
  SUBMIT_CONTACT_US_SUCCESS,
  SUBMIT_CONTACT_US_FAILURE,
  RESET_CONTACT_US,

  CHANGE_LEDGER_ACC_TYPE,

  LIST_LEDGER_ACCOUNTS_REQUEST,
  LIST_LEDGER_ACCOUNTS_SUCCESS,
  LIST_LEDGER_ACCOUNTS_FAILURE,

  SET_LEDGER_PATH,
} from '../actionTypes/generalActionTypes';
import { CREATE_CDP_SUCCESS, ADD_CDP_TO_CDPS } from '../actionTypes/onboardingActionTypes';
import {
  ADD_COLLATERAL_SUCCESS,
  APPROVE_DAI_SUCCESS,
  APPROVE_MAKER_SUCCESS,
  GENERATE_DAI_SUCCESS,
  TRANSFER_CDP_SUCCESS,
  WITHDRAW_ETH_SUCCESS,
  REPAY_DAI_SUCCESS,
  PAYBACK_DAI_SUCCESS,
  BOOST_SUCCESS,
  CLOSE_CDP_SUCCESS,
} from '../actionTypes/dashboardActionTypes';
import { LS_ACCOUNT, LEDGER_ACC_TYPES } from '../constants/general';
import { CANCEL_SELL_CDP_SUCCESS, SELL_CDP_SUCCESS } from '../actionTypes/marketplaceActionTypes';

const lsAccountType = localStorage.getItem(LS_ACCOUNT);

const INITIAL_STATE = {
  loggingIn: false,

  cdp: null,
  cdps: [],
  gettingCdp: false,
  gettingCdpError: '',

  connectingProvider: false,

  account: '',
  accountError: '',
  accountType: lsAccountType || '',
  balance: 0,
  network: 0,
  path: '',

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

  subscribingComingSoon: false,
  subscribingComingSoonSuccess: false,
  subscribingComingSoonError: '',

  sendingContactUs: false,
  sendingContactUsError: '',

  ledgerAccType: LEDGER_ACC_TYPES[0],
  ledgerAccounts: [],
  listingLedgerAccounts: false,
  listingLedgerAccountsError: '',
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
    case BOOST_SUCCESS:
    case SWITCH_CDP:
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

    case SUBSCRIBE_COMING_SOON_REQUEST:
      return { ...state, subscribingComingSoon: true, subscribingComingSoonError: '' };

    case SUBSCRIBE_COMING_SOON_SUCCESS:
      return {
        ...state,
        subscribingComingSoon: false,
        subscribingComingSoonSuccess: true,
        subscribingComingSoonError: '',
      };

    case SUBSCRIBE_COMING_SOON_FAILURE:
      return {
        ...state,
        subscribingComingSoon: false,
        subscribingComingSoonSuccess: false,
        subscribingComingSoonError: payload,
      };

    case RESET_SUBSCRIBE_COMING_SOON:
      return {
        ...state,
        subscribingComingSoon: false,
        subscribingComingSoonSuccess: false,
        subscribingComingSoonError: '',
      };

    case SUBMIT_CONTACT_US_REQUEST:
      return { ...state, sendingContactUs: true, sendingContactUsError: '' };

    case SUBMIT_CONTACT_US_SUCCESS:
      return {
        ...state,
        sendingContactUs: false,
        sendingContactUsError: '',
      };

    case SUBMIT_CONTACT_US_FAILURE:
      return {
        ...state,
        sendingContactUs: false,
        sendingContactUsError: payload,
      };

    case RESET_CONTACT_US:
      return {
        ...state,
        sendingContactUs: false,
        sendingContactUsError: '',
      };

    case GET_CDPS_SUCCESS:
    case CDP_IN_CDPS_CHANGED:
    case ADD_CDP_TO_CDPS:
      return { ...state, cdps: payload };

    case CLOSE_CDP_SUCCESS:
    case TRANSFER_CDP_SUCCESS:
      return { ...state, cdps: payload.cdps, cdp: payload.cdp };

    case CHANGE_LEDGER_ACC_TYPE:
      return { ...state, ledgerAccType: payload };

    case LIST_LEDGER_ACCOUNTS_REQUEST:
      return { ...state, listingLedgerAccounts: true, listingLedgerAccountsError: '' };

    case LIST_LEDGER_ACCOUNTS_SUCCESS:
      return {
        ...state,
        listingLedgerAccounts: false,
        listingLedgerAccountsError: '',
        ledgerAccounts: payload,
      };

    case LIST_LEDGER_ACCOUNTS_FAILURE:
      return {
        ...state,
        listingLedgerAccounts: false,
        listingLedgerAccountsError: payload,
      };

    case SET_LEDGER_PATH:
      return { ...state, path: payload };

    default:
      return state;
  }
};

import TransportU2F from '@ledgerhq/hw-transport-u2f/lib/TransportU2F';
import Eth from '@ledgerhq/hw-app-eth/lib/Eth';
import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,

  GET_CDP_REQUEST,
  GET_CDP_SUCCESS,
  GET_CDP_FAILURE,

  LOGIN_STARTED,
  LOGIN_FINISHED,

  ADD_PROXY_ADDRESS,
  GET_CDPS_SUCCESS,
} from '../actionTypes/generalActionTypes';
import { SET_ONBOARDING_FINISHED } from '../actionTypes/onboardingActionTypes';
import { LS_ACCOUNT, LS_CDP_SAVER_STATE } from '../constants/general';
import clientConfig from '../config/clientConfig.json';
import {
  isMetaMaskApproved, getBalance, getAccount, nameOfNetwork, getNetwork, metamaskApprove,
} from '../services/ethService';
import { setWeb3toMetamask, setupWeb3 } from '../services/web3Service';
import { notify } from './noitificationActions';
import { addToLsState, getLsExistingItemAndState, toDecimal } from '../utils/utils';
import { maker, getAddressCdp, getUpdatedCdpInfo } from '../services/cdpService';
import { trezorGetAccount } from '../services/trezorService';
import { listenToAccChange } from './generalActions';

/**
 * Sets that all ledger accounts in local storage lastUsed property is false
 */
const resetLsLedgerAccountsLastUsed = () => {
  let lsState = localStorage.getItem(LS_CDP_SAVER_STATE);

  if (!lsState) return;

  lsState = JSON.parse(lsState);

  lsState = lsState.map((_item) => {
    const item = { ..._item };
    if (item.ledgerPath) item.lastUsed = false;
    return item;
  });

  localStorage.setItem(LS_CDP_SAVER_STATE, JSON.stringify(lsState));
};

/**
 * Fetches the last saved lastUsed ledger account from ls
 */
const getLedgerLastUsedPath = () => {
  let lsState = localStorage.getItem(LS_CDP_SAVER_STATE);
  if (!lsState) throw new Error('There is no local storage state');

  lsState = JSON.parse(lsState);

  const itemIndex = lsState.findIndex(item => item.lastUsed && item.ledgerPath);
  if (itemIndex === -1) throw new Error('There is no last used ledger item');

  return lsState[itemIndex].ledgerPath;
};

/**
 * Tries to connect to the connected ledger hardwallet
 *
 * @param _path {String}
 * @param silent {Boolean}
 *
 * @return {Function}
 */
export const loginLedger = (_path, silent) => async (dispatch) => {
  dispatch({ type: CONNECT_PROVIDER });

  let path = _path;
  const accountType = 'ledger';

  setupWeb3();

  try {
    const _transport = await TransportU2F.create();
    const eth = new Eth(_transport);

    // If the path is missing that means it is a silent login
    if (silent) path = getLedgerLastUsedPath();

    const network = await getNetwork();
    const account = (await eth.getAddress(path)).address;
    const balance = toDecimal(await getBalance(account));

    dispatch({
      type: CONNECT_PROVIDER_SUCCESS,
      payload: {
        account, accountType, balance, network, path,
      },
    });

    resetLsLedgerAccountsLastUsed();
    localStorage.setItem(LS_ACCOUNT, 'ledger');
    addToLsState({ account, ledgerPath: path, lastUsed: true });

    if (!silent) notify(`Ledger account found ${account}`, 'success')(dispatch);
  } catch (err) {
    setupWeb3();
    dispatch({ type: CONNECT_PROVIDER_FAILURE, payload: err.message });

    if (!silent) notify(err.message, 'error')(dispatch);
  }
};

/**
 * Tries to connect to the connected trezor hardwallet
 *
 * @param path
 * @return {Function}
 */
export const loginTrezor = path => async (dispatch) => {
  dispatch({ type: CONNECT_PROVIDER });
  const accountType = 'trezor';

  setupWeb3();

  try {
    const network = await getNetwork();
    const account = await trezorGetAccount(path);
    const balance = toDecimal(await getBalance(account));

    dispatch({
      type: CONNECT_PROVIDER_SUCCESS,
      payload: {
        account, accountType, balance, network, path,
      },
    });

    localStorage.setItem(LS_ACCOUNT, 'trezor');

    notify(`Trezor account found ${account}`, 'success')(dispatch);
  } catch (err) {
    setupWeb3();
    dispatch({ type: CONNECT_PROVIDER_FAILURE, payload: err.message });
  }
};

/**
 * Tries to connect to the MetaMask web3 provider, also checks if the app is pre-approved
 *
 * @param silent {Boolean}
 *
 * @return {Function}
 */
export const loginMetaMask = silent => async (dispatch, getState) => {
  dispatch({ type: CONNECT_PROVIDER });
  const accountType = 'metamask';

  try {
    const metaMaskApproved = await isMetaMaskApproved();

    if (silent && !metaMaskApproved) {
      throw new Error('Provider not pre-approved');
    }

    await metamaskApprove();

    setWeb3toMetamask();

    const network = await getNetwork();

    if (clientConfig.network !== network) {
      throw new Error(`Wrong network - please set MetaMask to ${nameOfNetwork(clientConfig.network)}`);
    }

    const account = await getAccount();
    if (getState().general.account === account) return;

    const balance = toDecimal(await getBalance(account));

    dispatch({
      type: CONNECT_PROVIDER_SUCCESS,
      payload: {
        account, accountType, balance, network,
      },
    });

    localStorage.setItem(LS_ACCOUNT, 'metamask');

    if (!silent) notify(`Metamask account found ${account}`, 'success')(dispatch);
    dispatch(listenToAccChange());
  } catch (err) {
    setupWeb3();
    dispatch({ type: CONNECT_PROVIDER_FAILURE, payload: err.message });

    if (!silent) notify(err.message, 'error')(dispatch);
  }
};

/**
 * Handles when a cdp if fetched from the chain
 *
 * @return {Function}
 */
export const getCdp = () => async (dispatch, getState) => {
  dispatch({ type: GET_CDP_REQUEST });

  try {
    let payload = {};

    const { account } = getState().general;
    const { cdp, cdps, proxyAddress } = await getAddressCdp(account);

    if (!cdp) payload = null;
    else {
      const newData = await getUpdatedCdpInfo(cdp.depositedETH.toNumber(), cdp.debtDai.toNumber());
      payload = { ...cdp, ...newData };
    }

    dispatch({ type: GET_CDP_SUCCESS, payload });
    dispatch({ type: GET_CDPS_SUCCESS, payload: cdps });
    dispatch({ type: ADD_PROXY_ADDRESS, payload: proxyAddress });
  } catch (err) {
    dispatch({ type: GET_CDP_FAILURE, payload: err.message });
  }
};

/**
 * Gets LS state values for account and initializes them in the reducers
 *
 * @return {Function}
 */
export const setLsValuesToReducer = () => (dispatch, getState) => {
  const { account } = getState().general;

  if (!account) return;
  const { existingItem } = getLsExistingItemAndState(account);
  if (!existingItem) return;

  const { onboardingFinished } = existingItem;

  if (onboardingFinished) dispatch({ type: SET_ONBOARDING_FINISHED, payload: onboardingFinished });
};

/**
 * If the user has already once successfully added an account this will
 * try a silent login for that account type
 *
 * @return {Function}
 */
export const silentLogin = () => async (dispatch, getState) => {
  const { accountType } = getState().general;

  if (!accountType) return;

  dispatch({ type: LOGIN_STARTED });

  await maker.authenticate();

  try {
    switch (accountType) {
      case 'metamask': {
        await dispatch(loginMetaMask(true));
        break;
      }

      case 'ledger': {
        await dispatch(loginLedger('', true));
        break;
      }

      default:
        return dispatch({ type: LOGIN_FINISHED });
    }

    await dispatch(getCdp());
  } catch (err) {
    console.log('LOGIN ERROR', err);
  }

  dispatch(setLsValuesToReducer());
  dispatch({ type: LOGIN_FINISHED });
};

/**
 * Tries not silent login for the selected account type
 *
 * @param accountType {String}
 * @param history {Object}
 * @param to {String}
 * @param path {String}
 *
 * @return {Function}
 */
export const normalLogin = (accountType, history, to, path = '') => async (dispatch) => {
  dispatch({ type: LOGIN_STARTED });

  await maker.authenticate();

  try {
    switch (accountType) {
      case 'metamask': {
        await dispatch(loginMetaMask(false));
        history.push(to);
        break;
      }

      case 'trezor': {
        await dispatch(loginTrezor(path));
        history.push(to);
        break;
      }

      case 'ledger': {
        await dispatch(loginLedger(path));
        history.push(to);
        break;
      }

      default:
        return false;
    }

    await dispatch(getCdp());
  } catch (err) {
    console.log('LOGIN ERROR', err);
  }

  dispatch(setLsValuesToReducer());
  dispatch({ type: LOGIN_FINISHED });
};

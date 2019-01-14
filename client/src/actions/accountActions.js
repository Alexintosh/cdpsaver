import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,

  ADD_CDP,
} from '../actionTypes/generalActionTypes';
import {
  isMetaMaskApproved, getBalance, getAccount, nameOfNetwork, getNetwork, metamaskApprove,
} from '../services/ethService';
import { setWeb3toMetamask, setupWeb3 } from '../services/web3Service';
import { notify } from './noitificationActions';
import { isEmptyBytes, toDecimal } from '../utils/utils';
import clientConfig from '../config/clientConfig.json';
import { LS_ACCOUNT } from '../constants/general';
import { getAddressCdp } from '../services/cdpService';

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

    dispatch({ type: CONNECT_PROVIDER_SUCCESS, payload: { account, accountType, balance } });
    localStorage.setItem(LS_ACCOUNT, JSON.stringify({ accountType: 'metamask' }));
    notify(`Metamask account found ${account}`, 'success')(dispatch);
  } catch (err) {
    setupWeb3();
    dispatch({ type: CONNECT_PROVIDER_FAILURE, payload: err.message });

    if (!silent) notify(err.message, 'error')(dispatch);
  }
};


/**
 * If the user has already once successfully added an account this will
 * try a silent login for that account type
 *
 * @return {Function}
 */
export const silentLogin = () => async (dispatch, getState) => {
  const { accountType } = getState().general;

  switch (accountType) {
    case 'metamask': {
      await dispatch(loginMetaMask(true));
      break;
    }

    default:
      return false;
  }

  const cdp = await getAddressCdp(getState().general.account);

  console.log('CDP: ', cdp);

  if (!isEmptyBytes(cdp)) dispatch({ type: ADD_CDP, payload: cdp });
};

/**
 * Tries not silent login for the selected account type
 *
 * @param accountType {String}
 * @param history {Object}
 * @param to {String}
 *
 * @return {Function}
 */
export const normalLogin = (accountType, history, to) => async (dispatch, getState) => {
  // LOGIN TO WANTED ACCOUNT TYPE
  switch (accountType) {
    case 'metamask': {
      await dispatch(loginMetaMask(false));
      break;
    }

    default:
      return false;
  }

  const cdp = await getAddressCdp(getState().general.account);

  console.log('CDP: ', cdp);

  if (!isEmptyBytes(cdp)) dispatch({ type: ADD_CDP, payload: cdp });

  history.push(to);
};

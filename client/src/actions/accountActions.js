import {
  CONNECT_PROVIDER,
  CONNECT_PROVIDER_SUCCESS,
  CONNECT_PROVIDER_FAILURE,
} from '../actionTypes/generalActionTypes';
import {
  isMetaMaskApproved, setWeb3toMetamask, getBalance, getAccount, nameOfNetwork, getNetwork, metamaskApprove,
  setupWeb3,
} from '../services/ethService';
import { notify } from './noitificationActions';
import { toDecimal } from '../utils/utils';
import config from '../config/config.json';
import { LS_ACCOUNT } from '../constants/general';

/**
 * Tries to connect to the MetaMask web3 provider, also checks if the app is pre-approved
 *
 * @param silent {Boolean}
 * @param history {Object}
 * @param to {String}
 *
 * @return {Function}
 */
export const loginMetaMask = (silent, history, to) => async (dispatch, getState) => {
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

    if (config.network !== network) {
      throw new Error(`Wrong network - please set MetaMask to ${nameOfNetwork(config.network)}`);
    }

    const account = await getAccount();
    if (getState().general.account === account) return;

    const balance = toDecimal(await getBalance(account));

    dispatch({ type: CONNECT_PROVIDER_SUCCESS, payload: { account, accountType, balance } });
    localStorage.setItem(LS_ACCOUNT, JSON.stringify({ accountType: 'metamask' }));

    if (!silent) history.push(to);
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
export const silentLogin = () => (dispatch, getState) => {
  const { accountType } = getState().general;

  switch (accountType) {
    case 'metamask':
      dispatch(loginMetaMask(true, null, '/dashboard/saver'));
      break;

    default:
      return false;
  }
};

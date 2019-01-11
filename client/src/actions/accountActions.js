import {
  ADD_ACCOUNT,
  CONNECT_PROVIDER,
} from '../actionTypes/generalActionTypes';
import {
  isMetaMaskApproved, setWeb3toMetamask, getBalance, getAccount, nameOfNetwork, getNetwork, metamaskApprove,
  setupWeb3,
} from '../services/ethService';
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
    const balance = toDecimal(await getBalance(account));

    dispatch({ type: ADD_ACCOUNT, payload: { account, accountType, balance } });
    localStorage.setItem(LS_ACCOUNT, JSON.stringify({ accountType: 'metamask' }));

    // showNotification(`Metamask account found ${account}`, 'success');

    if (!silent) history.push(to);
    console.log('SHOW NOTIFICATION');
  } catch (err) {
    setupWeb3();

    if (!silent) {
      console.log('SHOW NOTIFICATION ERROR', err);
      // showNotification(err, 'error');
    }
  }
};

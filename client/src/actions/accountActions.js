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
} from '../actionTypes/generalActionTypes';
import {
  isMetaMaskApproved, getBalance, getAccount, nameOfNetwork, getNetwork, metamaskApprove,
} from '../services/ethService';
import { setWeb3toMetamask, setupWeb3 } from '../services/web3Service';
import { notify } from './noitificationActions';
import { toDecimal } from '../utils/utils';
import clientConfig from '../config/clientConfig.json';
import { LS_ACCOUNT } from '../constants/general';
import { maker, getAddressCdp, getUpdatedCdpInfo } from '../services/cdpService';

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

    await maker.addAccount('metamask', { type: 'browser' });

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

    localStorage.setItem(LS_ACCOUNT, JSON.stringify({ accountType: 'metamask' }));

    if (!silent) notify(`Metamask account found ${account}`, 'success')(dispatch);
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
    const { cdp, proxyAddress } = await getAddressCdp(account);

    if (!cdp) payload = null;
    else {
      const newData = await getUpdatedCdpInfo(cdp.depositedETH.toNumber(), cdp.debtDai.toNumber());
      payload = { ...cdp, ...newData };
    }

    dispatch({ type: GET_CDP_SUCCESS, payload });
    dispatch({ type: ADD_PROXY_ADDRESS, payload: proxyAddress });
  } catch (err) {
    dispatch({ type: GET_CDP_FAILURE, payload: err.message });
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

  if (!accountType) return;

  dispatch({ type: LOGIN_STARTED });

  await maker.authenticate();

  try {
    switch (accountType) {
      case 'metamask': {
        await dispatch(loginMetaMask(true));
        break;
      }

      default:
        return false;
    }

    await dispatch(getCdp());
  } catch (err) {
    console.log('LOGIN ERROR', err);
  }

  dispatch({ type: LOGIN_FINISHED });
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
export const normalLogin = (accountType, history, to) => async (dispatch) => {
  dispatch({ type: LOGIN_STARTED });

  await maker.authenticate();

  try {
    switch (accountType) {
      case 'metamask': {
        await dispatch(loginMetaMask(false));
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

  dispatch({ type: LOGIN_FINISHED });
};

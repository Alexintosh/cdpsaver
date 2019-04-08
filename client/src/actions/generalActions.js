import Maker from '@makerdao/dai';
import {
  GET_ETH_PRICE_REQUEST,
  GET_ETH_PRICE_SUCCESS,

  GET_CLOSE_DATA_REQUEST,
  GET_CLOSE_DATA_SUCCESS,
  GET_CLOSE_DATA_FAILURE,

  SUBSCRIBE_COMING_SOON_REQUEST,
  SUBSCRIBE_COMING_SOON_SUCCESS,
  SUBSCRIBE_COMING_SOON_FAILURE,
  RESET_SUBSCRIBE_COMING_SOON,

  SWITCH_CDP,

  SUBMIT_CONTACT_US_REQUEST,
  SUBMIT_CONTACT_US_SUCCESS,
  SUBMIT_CONTACT_US_FAILURE,
  RESET_CONTACT_US,

  CHANGE_LEDGER_ACC_TYPE,
} from '../actionTypes/generalActionTypes';
import { getUpdatedCdpInfo, maker } from '../services/cdpService';
import { getEthPrice } from '../services/priceService';
import { subscribeComingSoonApiCall, contactUsApiCall } from '../services/apiService';
import {
  getDaiAllowance, getDaiBalance, getMakerAllowance, getMakerBalance, weiToEth,
} from '../services/ethService';
import { addToLsState } from '../utils/utils';

const { DAI } = Maker;

/**
 * Checks the price of Ether and updates it in the state
 *
 * @return {Function}
 */
const updateEthPrice = () => async (dispatch) => {
  const ethPrice = await getEthPrice();
  dispatch({ type: GET_ETH_PRICE_SUCCESS, payload: parseFloat(parseFloat(ethPrice).toFixed(2)) });
};

/**
 * Periodically checks the price of Ether and updates it in the state
 *
 * @return {Function}
 */
export const updateEthPriceInterval = () => async (dispatch) => {
  dispatch({ type: GET_ETH_PRICE_REQUEST });

  await maker.authenticate();

  dispatch(updateEthPrice());
  setInterval(() => { dispatch(updateEthPrice()); }, 60000);
};

/**
 * Listens to account change and reloads the page if there is no account or
 * the account changes
 *
 * @return {Function}
 */
export const listenToAccChange = () => (dispatch, getState) => {
  const interval = setInterval(async () => {
    const { account, connectingProvider, accountType } = getState().general;

    if (connectingProvider) return;
    if (!account) return;
    if (accountType !== 'metamask') {
      console.log('Acc type', accountType);
      return clearInterval(interval);
    }

    const accounts = await window._web3.eth.getAccounts();

    if (!accounts[0]) window.location.reload();
    if (accounts[0] !== account) window.location.reload();
  }, 1000);
};

/**
 * Handles fetching of all the data needed to close a cdp
 *
 * @params paybackData {Boolean}
 *
 * @return {Function}
 */
export const getCloseDataAction = (paybackData = false) => async (dispatch, getState) => {
  dispatch({ type: GET_CLOSE_DATA_REQUEST });

  const { cdp, account, proxyAddress } = getState().general;
  const payload = {};

  try {
    const daiBalance = await getDaiBalance(account);

    if (paybackData) {
      payload.enoughMkrToWipe = (await getMakerBalance(account)) > 0;
    } else {
      payload.enoughMkrToWipe = await cdp.cdpInstance.enoughMkrToWipe(daiBalance, DAI.wei);
    }

    // If he has enough dai and maker tokens to pay check if they are unlocked
    if (payload.enoughMkrToWipe) {
      const daiAllowance = await getDaiAllowance(account, proxyAddress);
      const makerAllowance = await getMakerAllowance(account, proxyAddress);

      const governanceFee = (await cdp.cdpInstance.getGovernanceFee())._amount;

      payload.daiUnlocked = daiAllowance > cdp.debtDai;
      payload.makerUnlocked = makerAllowance > governanceFee;

      payload.daiBalance = parseFloat(weiToEth(daiBalance));
      payload.makerBalance = await getMakerBalance(account);
    }

    // if (!payload.enoughMkrToWipe) {
    //   // Check if the user can pay in ETH
    //   payload.enoughEthToWipe =
    // }

    dispatch({ type: GET_CLOSE_DATA_SUCCESS, payload });
  } catch (e) {
    dispatch({ type: GET_CLOSE_DATA_FAILURE, payload: e.message });
  }
};

/**
 * Sends the users email from the feature subscribe form to the mailchimp account
 *
 * @param email {String}
 * @return {*}
 */
export const subscribeComingSoonAction = ({ email }) => async (dispatch) => {
  dispatch({ type: SUBSCRIBE_COMING_SOON_REQUEST });

  try {
    const res = await subscribeComingSoonApiCall(email);

    if (!res.ok) {
      dispatch({ type: SUBSCRIBE_COMING_SOON_FAILURE, payload: 'Unable to send email' });
    } else {
      dispatch({ type: SUBSCRIBE_COMING_SOON_SUCCESS });
    }
  } catch (e) {
    dispatch({ type: SUBSCRIBE_COMING_SOON_FAILURE, payload: e.message });
  }
};

/**
 * Resets the subscribeComingSoon state in the reducer
 */
export const resetSubscribeComingSoon = () => (dispatch) => {
  dispatch({ type: RESET_SUBSCRIBE_COMING_SOON });
};

/**
 * Changes the current cdp with another one in the whole state
 *
 * @param value {Object}
 *
 * @return {Function}
 */
export const changeSelectedCdp = ({ value }) => async (dispatch, getState) => {
  const { cdps, ethPrice, account } = getState().general;
  const newCdpIndex = cdps.findIndex(_cdp => _cdp.id === value);

  const newCdp = cdps[newCdpIndex];
  const newData = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);
  const payload = { ...newCdp, ...newData };

  addToLsState({ account, cdpId: newCdp.id });

  dispatch({ type: SWITCH_CDP, payload });
};

/**
 * Sends an email through our server
 *
 * @param data {Object}
 * @param closeModal {Function}
 */
export const submitContactUs = (data, closeModal) => async (dispatch) => {
  dispatch({ type: SUBMIT_CONTACT_US_REQUEST });

  try {
    console.log(data);
    await contactUsApiCall(data);

    dispatch({ type: SUBMIT_CONTACT_US_SUCCESS });
    closeModal();
  } catch (e) {
    dispatch({ type: SUBMIT_CONTACT_US_FAILURE, payload: e.message });
  }
};

/**
 * Resets the subscribeComingSoon state in the reducer
 */
export const resetContactUs = () => (dispatch) => { dispatch({ type: RESET_CONTACT_US }); };

/**
 * Changes the connect page ledger account type select input value
 *
 * @param payload {Object}
 */
export const changeLedgerAccType = payload => (dispatch) => {
  dispatch({ type: CHANGE_LEDGER_ACC_TYPE, payload });
};

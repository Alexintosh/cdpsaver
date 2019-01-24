import {
  GET_ETH_PRICE_REQUEST,
  GET_ETH_PRICE_SUCCESS,

  GET_CLOSE_DATA_REQUEST,
  GET_CLOSE_DATA_SUCCESS,
  GET_CLOSE_DATA_FAILURE,
} from '../actionTypes/generalActionTypes';
import { maker } from '../services/cdpService';
import {
  getDaiAllowance, getDaiBalance, getMakerAllowance, getMakerBalance, weiToEth,
} from '../services/ethService';

/**
 * Checks the price of Ether and updates it in the state
 *
 * @param priceInterface {Object}
 *
 * @return {Function}
 */
const updateEthPrice = priceInterface => async (dispatch) => {
  const ethPrice = (await priceInterface.getEthPrice())._amount;
  dispatch({ type: GET_ETH_PRICE_SUCCESS, payload: parseFloat(ethPrice.toFixed(2)) });
};

/**
 * Periodically checks the price of Ether and updates it in the state
 *
 * @return {Function}
 */
export const updateEthPriceInterval = () => async (dispatch) => {
  dispatch({ type: GET_ETH_PRICE_REQUEST });

  await maker.authenticate();
  const priceInterface = maker.service('price');

  dispatch(updateEthPrice(priceInterface));
  setInterval(() => { dispatch(updateEthPrice(priceInterface)); }, 60000);
};

/**
 * Listens to account change and reloads the page if there is no account or
 * the account changes
 *
 * @return {Function}
 */
export const listenToAccChange = () => (dispatch, getState) => {
  setInterval(async () => {
    const { account, connectingProvider } = getState().general;

    if (connectingProvider) return;
    if (!account) return;

    const accounts = await window._web3.eth.getAccounts();

    if (!accounts[0]) window.location.reload();
    if (accounts[0] !== account) window.location.reload();
  }, 1000);
};

/**
 * Handles fetching of all the data needed to close a cdp
 *
 * @return {Function}
 */
export const getCloseDataAction = () => async (dispatch, getState) => {
  dispatch({ type: GET_CLOSE_DATA_REQUEST });

  const { cdp, account } = getState().general;
  const payload = {};

  try {
    const daiBalance = await getDaiBalance(account);
    payload.enoughMkrToWipe = await cdp.cdpInstance.enoughMkrToWipe(daiBalance);

    // TODO remove ! from line bellow, it was added for testing
    // If he has enough dai and maker tokens to pay check if they are unlocked
    if (!payload.enoughMkrToWipe) {
      const daiAllowance = await getDaiAllowance(account);
      const makerAllowance = await getMakerAllowance(account);

      const governanceFee = (await cdp.cdpInstance.getGovernanceFee())._amount;

      payload.daiUnlocked = daiAllowance > cdp.debtDai;
      payload.makerUnlocked = makerAllowance > governanceFee;

      payload.daiBalance = parseFloat(weiToEth(daiBalance));
      payload.makerBalance = await getMakerBalance(account);
    }

    // TODO do this
    // if (!payload.enoughMkrToWipe) {
    //   // Check if the user can pay in ETH
    //   payload.enoughEthToWipe =
    // }

    dispatch({ type: GET_CLOSE_DATA_SUCCESS, payload });
  } catch (e) {
    dispatch({ type: GET_CLOSE_DATA_FAILURE, payload: e.message });
  }
};

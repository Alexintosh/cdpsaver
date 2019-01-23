import { GET_ETH_PRICE_REQUEST, GET_ETH_PRICE_SUCCESS } from '../actionTypes/generalActionTypes';
import { maker } from '../services/cdpService';

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
export const getCloseDataAction = () => (dispatch, getState) => {};

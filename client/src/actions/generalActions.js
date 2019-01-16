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

import {
  GET_MARKETPLACE_CDP_DATA_REQUEST,
  GET_MARKETPLACE_CDP_DATA_SUCCESS,
  GET_MARKETPLACE_CDP_DATA_FAILURE,

  SELL_CDP_REQUEST,
  SELL_CDP_SUCCESS,
  SELL_CDP_FAILURE,
  RESET_SELL_CDP_FORM,
} from '../actionTypes/marketplaceActionTypes';
import { getCdpInfos } from '../services/cdpService';

/**
 * Dispatches action to save formatted Cdp data for an array of added cdp ids
 *
 * @return {Function}
 */
export const getMarketplaceCdpsData = () => async (dispatch) => {
  const mockCdpIds = [4691];
  dispatch({ type: GET_MARKETPLACE_CDP_DATA_REQUEST });

  try {
    const payload = await getCdpInfos(mockCdpIds);

    dispatch({ type: GET_MARKETPLACE_CDP_DATA_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_MARKETPLACE_CDP_DATA_FAILURE, payload: err });
  }
};

/**
 * Lists your CDP on the marketplace page
 *
 * @param sellPrice {Number}
 * @return {Function}
 */
export const sellCdp = ({ sellPrice }) => async (dispatch) => {
  dispatch({ type: SELL_CDP_REQUEST });

  const wait = () => new Promise((resolve) => {
    setTimeout(() => { resolve(); }, 1000);
  });

  try {
    await wait();

    dispatch({ type: SELL_CDP_SUCCESS });
  } catch (err) {
    dispatch({ type: SELL_CDP_FAILURE, payload: err });
  }
};

/**
 * Resets all values in the marketplace reducer tied to the sell cdp form
 *
 * @return {Function}
 */
export const resetSellCdpForm = () => (dispatch) => {
  dispatch({ type: RESET_SELL_CDP_FORM });
};

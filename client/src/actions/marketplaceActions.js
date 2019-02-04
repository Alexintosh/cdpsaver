import {
  GET_MARKETPLACE_CDP_DATA_REQUEST,
  GET_MARKETPLACE_CDP_DATA_SUCCESS,
  GET_MARKETPLACE_CDP_DATA_FAILURE,

  SELL_CDP_REQUEST,
  SELL_CDP_SUCCESS,
  SELL_CDP_FAILURE,
  RESET_SELL_CDP_FORM,

  BUY_CDP_REQUEST,
  BUY_CDP_SUCCESS,
  BUY_CDP_FAILURE,
} from '../actionTypes/marketplaceActionTypes';
import { getCdpInfos, maker } from '../services/cdpService';
import { getItemsOnSale } from '../services/ethService';
import { convertDaiToEth } from '../utils/utils';

/**
 * Formats the cdps from the marketplace contract so that they contain all data that is
 * needed in the interface
 *
 * @param cdps {Array}
 * @param cdpsWithDiscount {Array}
 * @param ethPrice {Number}
 * @return {Array}
 */
const formatMarketplaceCdps = (cdps, cdpsWithDiscount, ethPrice) => cdps.map((_cdp, index) => {
  const cdp = _cdp;
  const { debtDai, depositedETH, depositedUSD, debtUsd } = cdp; // eslint-disable-line
  const { discount } = cdpsWithDiscount[index];

  cdp.value = {
    eth: depositedETH - convertDaiToEth(debtDai, ethPrice),
    usd: depositedUSD - debtUsd,
  };

  cdp.price = {
    eth: cdp.value.eth - ((discount / 100) * cdp.value.eth),
    usd: cdp.value.usd - ((discount / 100) * cdp.value.usd),
  };

  cdp.discount = discount;

  return cdp;
});

/**
 * Dispatches action to save formatted Cdp data for an array of added cdp ids
 *
 * @return {Function}
 */
export const getMarketplaceCdpsData = () => async (dispatch, getState) => {
  dispatch({ type: GET_MARKETPLACE_CDP_DATA_REQUEST });

  let { ethPrice } = getState().general;

  try {
    if (!ethPrice) {
      await maker.authenticate();
      const price = maker.service('price');
      ethPrice = (await price.getEthPrice()).toNumber();
    }

    const marketplaceCdps = await getItemsOnSale();
    let payload = await getCdpInfos(marketplaceCdps.map(c => c.id));

    payload = formatMarketplaceCdps(payload, marketplaceCdps, ethPrice);

    dispatch({ type: GET_MARKETPLACE_CDP_DATA_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_MARKETPLACE_CDP_DATA_FAILURE, payload: err.message });
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

/**
 * Buys selected cdp from one user and transfers it to another
 */
export const buyCdp = () => async (dispatch) => {
  dispatch({ type: BUY_CDP_REQUEST });

  const wait = () => new Promise((resolve) => {
    setTimeout(() => { resolve(); }, 1000);
  });

  try {
    const payload = await wait();

    dispatch({ type: BUY_CDP_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: BUY_CDP_FAILURE, payload: err.message });
  }
};

/**
 * Switches between texts for the sell cdp button
 *
 * @param loggingIn {Boolean}
 * @param gettingCdp {Boolean}
 * @param cdp {Object}
 */
export const sellCdpButtonTooltipText = (loggingIn, gettingCdp, cdp) => {
  if (loggingIn && !gettingCdp) return 'Logging in';
  if (loggingIn && gettingCdp) return 'Getting cdp';
  if (!loggingIn && !gettingCdp && !cdp) return 'You don&#39;t own a cdp';
};

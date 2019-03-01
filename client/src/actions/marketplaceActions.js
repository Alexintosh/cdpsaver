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

  CANCEL_SELL_CDP_REQUEST,
  CANCEL_SELL_CDP_SUCCESS,
  CANCEL_SELL_CDP_FAILURE,
  RESET_CANCEL_SELL_CDP,
} from '../actionTypes/marketplaceActionTypes';
import { getCdpInfos } from '../services/cdpService';
import {
  getItemsOnSale, sellCdp, cancelSellCdp, buyCdp,
} from '../services/ethService';
import { getEthPrice } from '../services/priceService';
import { addToLsState, convertDaiToEth } from '../utils/utils';
import { sendTx } from './notificationsActions';
import { getCdp } from './accountActions';

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
    if (!ethPrice) ethPrice = parseFloat(await getEthPrice());

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
export const sellCdpAction = ({ discount }) => async (dispatch, getState) => {
  dispatch({ type: SELL_CDP_REQUEST });

  const proxySendHandler = promise => sendTx(promise, 'Sell CDP', dispatch, getState);
  const { proxyAddress, account, cdp } = getState().general;

  try {
    await sellCdp(proxySendHandler, account, cdp.id, discount, proxyAddress);

    addToLsState({ account, onboardingFinished: false });

    dispatch({ type: SELL_CDP_SUCCESS, payload: { ...cdp, onSale: true } });
    dispatch(getMarketplaceCdpsData());
  } catch (err) {
    dispatch({ type: SELL_CDP_FAILURE, payload: err.message });
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
 * Resets all values in the marketplace reducer tied to the cancel sell cdp
 *
 * @return {Function}
 */
export const resetCancelSellCdp = () => (dispatch) => {
  dispatch({ type: RESET_CANCEL_SELL_CDP });
};

/**
 * Buys selected cdp from one user and transfers it to another
 *
 * @param cdpId {Number}
 * @param discount {Number}
 */
export const buyCdpAction = (cdpId, discount) => async (dispatch, getState) => {
  dispatch({ type: BUY_CDP_REQUEST });

  const proxySendHandler = promise => sendTx(promise, 'Buy CDP', dispatch, getState);
  const { account } = getState().general;

  try {
    const payload = await buyCdp(proxySendHandler, cdpId, account, discount);

    dispatch({ type: BUY_CDP_SUCCESS, payload });
    dispatch(getMarketplaceCdpsData());
    dispatch(getCdp());
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

/**
 * De-lists your CDP on the marketplace page
 *
 * @return {Function}
 */
export const cancelSellCdpAction = () => async (dispatch, getState) => {
  dispatch({ type: CANCEL_SELL_CDP_REQUEST });

  const proxySendHandler = promise => sendTx(promise, 'Cancel CDP sale', dispatch, getState);
  const { proxyAddress, account, cdp } = getState().general;

  try {
    await cancelSellCdp(proxySendHandler, account, cdp.id, proxyAddress);

    dispatch({ type: CANCEL_SELL_CDP_SUCCESS, payload: { ...cdp, onSale: false } });
    dispatch(getMarketplaceCdpsData());
  } catch (err) {
    dispatch({ type: CANCEL_SELL_CDP_FAILURE, payload: err.message });
  }
};

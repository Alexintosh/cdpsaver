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
import { CDP_IN_CDPS_CHANGED } from '../actionTypes/generalActionTypes';
import { getCdpInfos } from '../services/cdpService';
import {
  getItemsOnSale, sellCdp, cancelSellCdp, buyCdp,
} from '../services/ethService';
import { getEthPrice } from '../services/priceService';
import { convertDaiToEth } from '../utils/utils';
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

    let payload = await getCdpInfos(marketplaceCdps.map(c => c.id).filter(Number));

    payload = formatMarketplaceCdps(payload, marketplaceCdps, ethPrice);

    dispatch({ type: GET_MARKETPLACE_CDP_DATA_SUCCESS, payload });
  } catch (err) {
    console.log(err);
    dispatch({ type: GET_MARKETPLACE_CDP_DATA_FAILURE, payload: err.message });
  }
};

/**
 * Switches the passed cdp with the same cdp in the cdps array in the general reducer
 *
 * @param cdp {Object}
 *
 * @return {Function}
 */
const changeCdpInCdps = cdp => (dispatch, getState) => {
  const { cdps } = getState().general;

  const cdpIndex = cdps.findIndex(_cdp => _cdp.id === cdp.id);
  const newCdps = [...cdps];

  newCdps.splice(cdpIndex, 1, cdp);

  dispatch({ type: CDP_IN_CDPS_CHANGED, payload: newCdps });
};

/**
 * Lists your CDP on the marketplace page
 *
 * @param sellPrice {Number}
 * @return {Function}
 */
export const sellCdpAction = ({ discount }) => async (dispatch, getState) => {
  dispatch({ type: SELL_CDP_REQUEST });

  const proxySendHandler = (promise, waitForSign) => sendTx(promise, 'Sell CDP', dispatch, getState, waitForSign);
  const {
    proxyAddress, account, cdp, accountType, path,
  } = getState().general;

  try {
    await sellCdp(accountType, path, proxySendHandler, account, cdp.id, discount, proxyAddress);

    const payload = { ...cdp, onSale: true };

    dispatch(changeCdpInCdps(payload));
    dispatch({ type: SELL_CDP_SUCCESS, payload });
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
 */
export const buyCdpAction = cdpId => async (dispatch, getState) => {
  dispatch({ type: BUY_CDP_REQUEST });

  const proxySendHandler = (promise, waitForSign) => sendTx(promise, 'Buy CDP', dispatch, getState, waitForSign);
  const {
    account, proxyAddress, accountType, path,
  } = getState().general;

  try {
    const payload = await buyCdp(accountType, path, proxySendHandler, cdpId, account, proxyAddress);

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
 * @param allOnSale {Boolean}
 */
export const sellCdpButtonTooltipText = (loggingIn, gettingCdp, cdp, allOnSale) => {
  if (loggingIn && !gettingCdp) return 'Logging in';
  if (loggingIn && gettingCdp) return 'Getting cdp';
  if (!loggingIn && !gettingCdp && !cdp) return 'You don&#39;t own a cdp';
  if (!loggingIn && !gettingCdp && cdp && allOnSale) return 'All your cdps are on sale';
};

/**
 * De-lists your CDP on the marketplace page
 *
 * @return {Function}
 */
export const cancelSellCdpAction = () => async (dispatch, getState) => {
  dispatch({ type: CANCEL_SELL_CDP_REQUEST });

  const proxySendHandler = (promise, waitForSign) => sendTx(promise, 'Cancel CDP sale', dispatch, getState, waitForSign); // eslint-disable-line
  const {
    proxyAddress, account, cdp, accountType, path,
  } = getState().general;

  try {
    await cancelSellCdp(accountType, path, proxySendHandler, account, cdp.id, proxyAddress);

    const payload = { ...cdp, onSale: false };

    dispatch(changeCdpInCdps(payload));
    dispatch({ type: CANCEL_SELL_CDP_SUCCESS, payload });
    dispatch(getMarketplaceCdpsData());
  } catch (err) {
    dispatch({ type: CANCEL_SELL_CDP_FAILURE, payload: err.message });
  }
};

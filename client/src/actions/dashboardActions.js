import { change, untouch } from 'redux-form';
import {
  GENERATE_DAI_REQUEST,
  GENERATE_DAI_SUCCESS,
  GENERATE_DAI_FAILURE,

  GET_MAX_DAI_REQUEST,
  GET_MAX_DAI_SUCCESS,
  GET_MAX_DAI_FAILURE,

  WITHDRAW_ETH_REQUEST,
  WITHDRAW_ETH_SUCCESS,
  WITHDRAW_ETH_FAILURE,

  GET_MAX_ETH_WITHDRAW_REQUEST,
  GET_MAX_ETH_WITHDRAW_SUCCESS,
  GET_MAX_ETH_WITHDRAW_FAILURE,

  ADD_COLLATERAL_REQUEST,
  ADD_COLLATERAL_SUCCESS,
  ADD_COLLATERAL_FAILURE,

  GET_AFTER_CDP_REQUEST,
  GET_AFTER_CDP_SUCCESS,
  GET_AFTER_CDP_FAILURE,

  APPROVE_DAI_REQUEST,
  APPROVE_DAI_SUCCESS,
  APPROVE_DAI_FAILURE,

  APPROVE_MAKER_REQUEST,
  APPROVE_MAKER_SUCCESS,
  APPROVE_MAKER_FAILURE,

  TRANSFER_CDP_REQUEST,
  TRANSFER_CDP_SUCCESS,
  TRANSFER_CDP_FAILURE,

  REPAY_DAI_REQUEST,
  REPAY_DAI_SUCCESS,
  REPAY_DAI_FAILURE,

  PAYBACK_DAI_REQUEST,
  PAYBACK_DAI_SUCCESS,
  PAYBACK_DAI_FAILURE,

  GET_REPAY_MODAL_DATA_REQUEST,
  GET_REPAY_MODAL_DATA_SUCCESS,
  GET_REPAY_MODAL_DATA_FAILURE,
  RESET_REPAY_MODAL,

  GET_BOOST_MODAL_DATA_REQUEST,
  GET_BOOST_MODAL_DATA_SUCCESS,
  GET_BOOST_MODAL_DATA_FAILURE,
  RESET_BOOST_MODAL,

  BOOST_REQUEST,
  BOOST_SUCCESS,
  BOOST_FAILURE,

  GET_MAX_ETH_REPAY_REQUEST,
  GET_MAX_ETH_REPAY_SUCCESS,
  GET_MAX_ETH_REPAY_FAILURE,

  GET_MAX_DAI_BOOST_REQUEST,
  GET_MAX_DAI_BOOST_SUCCESS,
  GET_MAX_DAI_BOOST_FAILURE,

  CLOSE_CDP_REQUEST,
  CLOSE_CDP_SUCCESS,
  CLOSE_CDP_FAILURE,
} from '../actionTypes/dashboardActionTypes';
import {
  approveDai,
  approveMaker,
  callProxyContract,
  transferCdp,
  getEthDaiKyberExchangeRate,
  getDaiEthKyberExchangeRate,
  callSaverProxyContract,
  getMaxEthRepay,
  getMaxDaiBoost,
  paybackWithConversion,
  closeWithConversion,
  getEnoughMkrToWipe,
  getMakerAllowance,
} from '../services/ethService';
import { getMaxDai, getMaxEthWithdraw, getUpdatedCdpInfo } from '../services/cdpService';
import { MM_DENIED_TX_ERROR } from '../constants/general';
import { sendTx } from './notificationsActions';
import { addToLsState, formatNumber } from '../utils/utils';

/**
 * Resets the provided redux form fileds
 *
 * @param formName {String}
 * @param fieldsObj {Object}
 */
const resetFields = (formName, fieldsObj) => (dispatch) => {
  Object.keys(fieldsObj).forEach((fieldKey) => {
    dispatch(change(formName, fieldKey, fieldsObj[fieldKey]));
    dispatch(untouch(formName, fieldKey));
  });
};

/**
 * Handles redux actions for when the number of max dai that can be generated is calculating
 *
 * @return {Function}
 */
export const getMaxDaiAction = () => async (dispatch, getState) => {
  dispatch({ type: GET_MAX_DAI_REQUEST });

  try {
    const { cdp, ethPrice } = getState().general;

    const payload = await getMaxDai(cdp.debtDai, cdp.depositedETH.toNumber(), ethPrice);

    dispatch({ type: GET_MAX_DAI_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_MAX_DAI_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for when the number of max eth that can be used to repay debt is calculating
 *
 * @return {Function}
 */
export const getMaxEthRepayAction = () => async (dispatch, getState) => {
  dispatch({ type: GET_MAX_ETH_REPAY_REQUEST });

  const { cdp } = getState().general;

  try {
    let payload = await getMaxEthRepay(cdp.id, cdp.depositedETH.toNumber());

    if (cdp.debtDai.toNumber() === 0) payload = 0;

    dispatch({ type: GET_MAX_ETH_REPAY_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_MAX_ETH_REPAY_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for when the number of max Dai that can be used to boost cdp ether is calculating
 *
 * @return {Function}
 */
export const getMaxDaiBoostAction = () => async (dispatch, getState) => {
  dispatch({ type: GET_MAX_DAI_BOOST_REQUEST });

  try {
    const payload = await getMaxDaiBoost(getState().general.cdp.id);

    dispatch({ type: GET_MAX_DAI_BOOST_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_MAX_DAI_BOOST_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for when the number of max eth that can be withdrawn is calculating
 *
 * @return {Function}
 */
export const getMaxEthWithdrawAction = () => async (dispatch, getState) => {
  dispatch({ type: GET_MAX_ETH_WITHDRAW_REQUEST });

  try {
    const { cdp, ethPrice } = getState().general;

    const payload = await getMaxEthWithdraw(cdp.debtDai, cdp.depositedETH.toNumber(), ethPrice);

    dispatch({ type: GET_MAX_ETH_WITHDRAW_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_MAX_ETH_WITHDRAW_FAILURE, payload: err.message });
  }
};

/**
 * Fetches max values for the borrow manage page tab cdp actions
 *
 * @return {Function}
 */
export const getBorrowFormMaxValues = () => (dispatch) => {
  dispatch(getMaxDaiAction());
  dispatch(getMaxEthWithdrawAction());
  dispatch(getMaxDaiBoostAction());
};

/**
 * Fetches max values for the payback manage page tab cdp actions
 *
 * @return {Function}
 */
export const getPaybackFormMaxValues = () => (dispatch) => {
  dispatch(getMaxEthRepayAction());
};

/**
 * Handles redux actions for the generate dai smart contract call
 *
 * @param amountDai {String}
 * @return {Function}
 */
export const generateDaiAction = amountDai => async (dispatch, getState) => {
  dispatch({ type: GENERATE_DAI_REQUEST });

  const proxySendHandler = (promise, waitForSign) => {
    const amount = formatNumber(parseFloat(amountDai), 2);
    return sendTx(promise, `Generate ${amount} DAI`, dispatch, getState, waitForSign);
  };

  try {
    const {
      cdp, account, proxyAddress, ethPrice, accountType, path,
    } = getState().general;
    const params = [proxySendHandler, amountDai.toString(), cdp.id, proxyAddress, account, 'draw', ethPrice];

    const payload = await callProxyContract(accountType, path, ...params);

    dispatch({ type: GENERATE_DAI_SUCCESS, payload });
    dispatch({ type: GET_AFTER_CDP_SUCCESS, payload: { afterCdp: null } });

    dispatch(change('managerBorrowForm', 'generateDaiAmount', null));
    dispatch(getBorrowFormMaxValues());
  } catch (err) {
    dispatch({ type: GENERATE_DAI_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for the withdraw eth from cdp smart contract call
 *
 * @param amountEth {String}
 *
 * @return {Function}
 */
export const withdrawEthAction = amountEth => async (dispatch, getState) => {
  dispatch({ type: WITHDRAW_ETH_REQUEST });

  const proxySendHandler = (promise, waitForSign) => {
    const amount = formatNumber(parseFloat(amountEth), 2);
    return sendTx(promise, `Withdraw ${amount} ETH`, dispatch, getState, waitForSign);
  };

  try {
    const {
      cdp, account, proxyAddress, ethPrice, accountType, path,
    } = getState().general;
    const params = [proxySendHandler, amountEth.toString(), cdp.id, proxyAddress, account, 'free', ethPrice];

    const payload = await callProxyContract(accountType, path, ...params);

    dispatch({ type: WITHDRAW_ETH_SUCCESS, payload });
    dispatch({ type: GET_AFTER_CDP_SUCCESS, payload: { afterCdp: null } });

    dispatch(change('managerBorrowForm', 'withdrawEthAmount', null));
    dispatch(getBorrowFormMaxValues());
  } catch (err) {
    dispatch({ type: WITHDRAW_ETH_FAILURE, payload: err.message });
  }
};

/**
 * Gets all the data that is displayed inside the repay modal
 *
 * @param amount {String}
 *
 * @return {Function}
 */
export const getRepayModalData = amount => async (dispatch, getState) => {
  dispatch({ type: GET_REPAY_MODAL_DATA_REQUEST });

  try {
    const { cdp } = getState().general;

    const fee = (await cdp.cdpInstance.getGovernanceFee())._amount.toNumber();
    const exchangeRate = await getEthDaiKyberExchangeRate(amount);
    const repayDaiAmount = parseFloat(amount) * exchangeRate;

    const payload = { repayStabilityFee: fee, repayDaiAmount, repayExchangeRate: exchangeRate };

    dispatch({ type: GET_REPAY_MODAL_DATA_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_REPAY_MODAL_DATA_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for the repay dai from cdp smart contract call
 *
 * @param _amountEth {Number}
 * @param amountDai {Number}
 * @param closeModal {Function}
 *
 * @return {Function}
 */
export const repayDaiAction = (_amountEth, amountDai, closeModal) => async (dispatch, getState) => {
  dispatch({ type: REPAY_DAI_REQUEST });

  const proxySendHandler = (promise, waitForSign) => {
    const amount = formatNumber(parseFloat(_amountEth), 2);
    return sendTx(promise, `Repay ${amount} ETH`, dispatch, getState, waitForSign);
  };

  try {
    const { cdp, proxyAddress, account, ethPrice, accountType, path } = getState().general; // eslint-disable-line
    const { maxEthRepay } = getState().dashboard;

    const enoughMkrToWipe = await getEnoughMkrToWipe(account, cdp.id, amountDai.toString());
    const makerAllowance = await getMakerAllowance(account, proxyAddress);
    const governanceFee = (await cdp.cdpInstance.getGovernanceFee())._amount;
    const makerUnlocked = makerAllowance > governanceFee;

    // TODO show unlock maker form in the future
    const buyMkr = !(enoughMkrToWipe && makerUnlocked);

    const amountEth = _amountEth === maxEthRepay ? 0 : _amountEth;

    const params = [proxySendHandler, amountEth.toString(), cdp.id, proxyAddress, account, 'repay', ethPrice, buyMkr]; // eslint-disable-line

    const payload = await callSaverProxyContract(accountType, path, ...params);

    dispatch({ type: REPAY_DAI_SUCCESS, payload });
    dispatch({ type: GET_AFTER_CDP_SUCCESS, payload: { afterCdp: null } });

    dispatch(change('managerPaybackForm', 'repayDaiAmount', null));
    dispatch(closeModal());
    dispatch(getPaybackFormMaxValues());
  } catch (err) {
    dispatch({ type: REPAY_DAI_FAILURE, payload: err.message });
  }
};

/**
 * Resets the state for the repay modal
 *
 * @return {Function}
 */
export const resetRepayModal = () => (dispatch) => { dispatch({ type: RESET_REPAY_MODAL }); };

/**
 * Gets all the data that is displayed inside the boost modal
 *
 * @param amount {Number}
 * @return {Function}
 */
export const getBoostModalData = amount => async (dispatch) => {
  dispatch({ type: GET_BOOST_MODAL_DATA_REQUEST });

  try {
    const exchangeRate = await getDaiEthKyberExchangeRate(amount.toString());
    const boostEthAmount = exchangeRate * amount;

    dispatch({ type: GET_BOOST_MODAL_DATA_SUCCESS, payload: { boostEthAmount, boostExchangeRate: exchangeRate } });
  } catch (err) {
    dispatch({ type: GET_BOOST_MODAL_DATA_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for the repay dai from cdp smart contract call
 *
 * @param _amountDai {Number}
 * @param closeModal {Function}
 *
 * @return {Function}
 */
export const boostAction = (_amountDai, closeModal) => async (dispatch, getState) => {
  dispatch({ type: BOOST_REQUEST });

  const proxySendHandler = (promise, waitForSign) => {
    const amount = formatNumber(parseFloat(_amountDai), 2);
    return sendTx(promise, `Boost ${amount} DAI`, dispatch, getState, waitForSign);
  };

  try {
    const { cdp, proxyAddress, account, ethPrice, accountType, path } = getState().general; // eslint-disable-line
    const { maxDaiBoost } = getState().dashboard;

    const amountDai = _amountDai === maxDaiBoost ? 0 : _amountDai;

    const params = [proxySendHandler, amountDai.toString(), cdp.id, proxyAddress, account, 'boost', ethPrice];

    const payload = await callSaverProxyContract(accountType, path, ...params);

    dispatch({ type: BOOST_SUCCESS, payload });
    dispatch({ type: GET_AFTER_CDP_SUCCESS, payload: { afterCdp: null } });

    dispatch(change('managerBorrowForm', 'boostAmount', null));
    dispatch(closeModal());
    dispatch(getBorrowFormMaxValues());
  } catch (err) {
    dispatch({ type: BOOST_FAILURE, payload: err.message });
  }
};

/**
 * Resets the state for the repay modal
 *
 * @return {Function}
 */
export const resetBoostModal = () => (dispatch) => { dispatch({ type: RESET_BOOST_MODAL }); };

/**
 * Handles redux actions for the add eth collateral to the cdp smart contract call
 *
 * @param amountEth {String}
 *
 * @return {Function}
 */
export const addCollateralAction = amountEth => async (dispatch, getState) => {
  dispatch({ type: ADD_COLLATERAL_REQUEST });

  const proxySendHandler = (promise, waitForSign) => {
    const amount = formatNumber(parseFloat(amountEth), 2);
    return sendTx(promise, `Add collateral: ${amount} ETH`, dispatch, getState, waitForSign);
  };

  try {
    const {
      cdp, account, proxyAddress, ethPrice, accountType, path,
    } = getState().general; // eslint-disable-line
    const params = [proxySendHandler, amountEth.toString(), cdp.id, proxyAddress, account, 'lock', ethPrice, true];

    const payload = await callProxyContract(accountType, path, ...params);

    dispatch({ type: ADD_COLLATERAL_SUCCESS, payload });
    dispatch({ type: GET_AFTER_CDP_SUCCESS, payload: { afterCdp: null } });

    dispatch(change('managerPaybackForm', 'addCollateralAmount', null));
  } catch (err) {
    dispatch({ type: ADD_COLLATERAL_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for return dai to the cdp smart contract call
 *
 * @param amountDai {String}
 * @param closeModal {Function}
 *
 * @return {Function}
 */
export const paybackDaiAction = (amountDai, closeModal) => async (dispatch, getState) => {
  dispatch({ type: PAYBACK_DAI_REQUEST });

  const proxySendHandler = (promise, waitForSign) => {
    const amount = formatNumber(parseFloat(amountDai), 2);
    return sendTx(promise, `Payback ${amount} DAI`, dispatch, getState, waitForSign);
  };

  try {
    const {
      cdp, account, proxyAddress, ethPrice, enoughMkrToWipe, accountType, path,
    } = getState().general;

    let payload = {};

    if (enoughMkrToWipe) {
      const params = [proxySendHandler, amountDai.toString(), cdp.id, proxyAddress, account, 'wipe', ethPrice, false, true]; // eslint-disable-line
      payload = await callProxyContract(accountType, path, ...params);
    } else {
      const params = [proxySendHandler, account, amountDai.toString(), cdp.id, proxyAddress, ethPrice];
      payload = await paybackWithConversion(accountType, path, ...params);
    }

    dispatch({ type: PAYBACK_DAI_SUCCESS, payload });
    dispatch(change('managerPaybackForm', 'paybackAmount', null));

    closeModal();
  } catch (err) {
    dispatch({ type: PAYBACK_DAI_FAILURE, payload: err.message });
  }
};

/**
 * Calculates the changed cdp value
 *
 * @param _amount {String}
 * @param type {String}
 *
 * @return {Function}
 */
export const setAfterValue = (_amount, type) => async (dispatch, getState) => {
  if (!_amount) return dispatch({ type: GET_AFTER_CDP_SUCCESS, payload: { afterCdp: null } });

  dispatch({ type: GET_AFTER_CDP_REQUEST });

  try {
    const amount = parseFloat(_amount);

    const { afterType } = getState().dashboard;
    const { ethPrice, cdp } = getState().general;
    const depositedEth = cdp.depositedETH.toNumber();
    const debtDai = cdp.debtDai.toNumber();

    const payload = {};

    if (type !== afterType) payload.afterType = type;

    // BORROW FORM
    if (type === 'generate') {
      payload.afterCdp = await getUpdatedCdpInfo(depositedEth, cdp.generatedDAI + amount, ethPrice);
      payload.afterCdp.debtDai = debtDai + amount;
      payload.afterCdp.depositedETH = depositedEth;

      dispatch(resetFields('managerBorrowForm', { withdrawEthAmount: '', repayDaiAmount: '' }));
    }

    if (type === 'withdraw') {
      payload.afterCdp = await getUpdatedCdpInfo(depositedEth - amount, cdp.generatedDAI, ethPrice);
      payload.afterCdp.debtDai = debtDai;
      payload.afterCdp.depositedETH = depositedEth - amount;

      if (debtDai === 0) {
        payload.afterCdp.liquidationPrice = 0;
        payload.afterCdp.ratio = 0;
      }

      dispatch(resetFields('managerBorrowForm', { generateDaiAmount: '', repayDaiAmount: '' }));
    }

    if (type === 'repay') {
      const rate = await getEthDaiKyberExchangeRate(amount);

      const daiAmount = (rate * amount) > cdp.generatedDAI ? 0 : cdp.generatedDAI - (rate * amount);

      payload.afterCdp = {};
      payload.afterCdp.debtDai = daiAmount;
      payload.afterCdp.depositedETH = depositedEth - amount;

      // eslint-disable-next-line max-len
      const { liquidationPrice, ratio } = await getUpdatedCdpInfo(payload.afterCdp.depositedETH, payload.afterCdp.debtDai, ethPrice);

      payload.afterCdp.liquidationPrice = liquidationPrice;
      payload.afterCdp.ratio = ratio;

      dispatch(resetFields('managerPaybackForm', { paybackAmount: '', addCollateralAmount: '' }));
    }

    // PAYBACK FORM
    if (type === 'payback') {
      const daiAmount = amount > cdp.generatedDAI ? 0 : cdp.generatedDAI - amount;
      payload.afterCdp = await getUpdatedCdpInfo(depositedEth, daiAmount, ethPrice);
      payload.afterCdp.debtDai = debtDai - amount;
      payload.afterCdp.depositedETH = depositedEth;

      dispatch(resetFields('managerPaybackForm', { addCollateralAmount: '', boostAmount: '' }));
    }

    if (type === 'collateral') {
      payload.afterCdp = await getUpdatedCdpInfo(depositedEth + amount, cdp.generatedDAI, ethPrice);
      payload.afterCdp.debtDai = debtDai;
      payload.afterCdp.depositedETH = depositedEth + amount;

      dispatch(resetFields('managerPaybackForm', { paybackAmount: '', boostAmount: '' }));
    }

    if (type === 'boost') {
      const rate = await getDaiEthKyberExchangeRate(amount);

      payload.afterCdp = await getUpdatedCdpInfo(depositedEth + (amount * rate), cdp.generatedDAI + amount, ethPrice);
      payload.afterCdp.debtDai = debtDai + amount;
      payload.afterCdp.depositedETH = depositedEth + (amount * rate);

      dispatch(resetFields('managerBorrowForm', { generateDaiAmount: '', withdrawEthAmount: '' }));
    }

    if (type === 'clear') payload.afterCdp = null;

    dispatch({ type: GET_AFTER_CDP_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_AFTER_CDP_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for when the user wants to approve his dai in order to close his cdp
 *
 * @return {Function}
 */
export const approveDaiAction = () => async (dispatch, getState) => {
  dispatch({ type: APPROVE_DAI_REQUEST });

  const notificationPromise = (promise, waitForSign) => sendTx(promise, 'Approve DAI', dispatch, getState, waitForSign);

  try {
    const { account, proxyAddress, accountType, path } = getState().general; // eslint-disable-line

    await approveDai(accountType, path, account, proxyAddress, notificationPromise);

    dispatch({ type: APPROVE_DAI_SUCCESS });
  } catch (err) {
    const payload = err.message.includes(MM_DENIED_TX_ERROR) ? '' : err.message;

    dispatch({ type: APPROVE_DAI_FAILURE, payload });
  }
};

/**
 * Handles redux actions for when the user wants to approve his maker in order to close his cdp
 *
 * @return {Function}
 */
export const approveMakerAction = () => async (dispatch, getState) => {
  dispatch({ type: APPROVE_MAKER_REQUEST });

  const notificationPromise = (promise, waitForSign) => sendTx(promise, 'Approve MKR', dispatch, getState, waitForSign);

  const { account, proxyAddress, accountType, path } = getState().general; // eslint-disable-line

  try {
    await approveMaker(accountType, path, account, proxyAddress, notificationPromise);

    dispatch({ type: APPROVE_MAKER_SUCCESS });
  } catch (err) {
    const payload = err.message.includes(MM_DENIED_TX_ERROR) ? '' : err.message;

    dispatch({ type: APPROVE_MAKER_FAILURE, payload });
  }
};

/**
 * Handles redux actions for when the user wants to transfer his cdp to another address
 *
 * @param formValues {Object}
 * @param history {Object}
 * @param closeModal {Function}
 *
 * @return {Function}
 */
export const transferCdpAction = ({ toAddress }, history, closeModal) => async (dispatch, getState) => {
  dispatch({ type: TRANSFER_CDP_REQUEST });

  const proxySendHandler = (promise, waitForSign) => sendTx(promise, 'Transfer CDP', dispatch, getState, waitForSign);

  try {
    const {
      account, cdp, cdps, proxyAddress, accountType, path,
    } = getState().general;

    await transferCdp(accountType, path, proxySendHandler, account, toAddress, cdp.id, proxyAddress);
    await (() => new Promise((resolve) => { setTimeout(() => { resolve(true); }, 5000); }))();

    const newCdps = [...cdps];
    const closedCdpIndex = cdps.findIndex(_cdp => _cdp.id === cdp.id);
    newCdps.splice(closedCdpIndex, 1);

    const newCdp = newCdps.length > 0 ? newCdps[0] : null;

    addToLsState({ account, onboardingFinished: false, cdpId: newCdp ? newCdp.id : -1 });

    closeModal();

    if (newCdp === null) history.push('/create-cdp');
    else history.push('/dashboard/manage');

    dispatch({ type: TRANSFER_CDP_SUCCESS, payload: { cdps: newCdps, cdp: newCdp } });
  } catch (err) {
    const payload = err.message.includes(MM_DENIED_TX_ERROR) ? '' : err.message;

    dispatch({ type: TRANSFER_CDP_FAILURE, payload });
  }
};

/**
 * Closes the currently loaded CDP
 *
 * @param closeModal {Function}
 * @param history {Object}
 *
 * @return {Function}
 */
export const closeCdpAction = (closeModal, history) => async (dispatch, getState) => {
  dispatch({ type: CLOSE_CDP_REQUEST });

  const proxySendHandler = (promise, waitForSign) => sendTx(promise, 'Close CDP', dispatch, getState, waitForSign);

  try {
    const {
      cdp, cdps, account, proxyAddress, ethPrice, accountType, path, enoughMkrToWipe,
    } = getState().general;

    if (enoughMkrToWipe) {
      const params = [proxySendHandler, '0', cdp.id, proxyAddress, account, 'shut', ethPrice, true, false];
      await callProxyContract(accountType, path, ...params);
    } else {
      const params = [proxySendHandler, account, cdp.id, proxyAddress, ethPrice];
      await closeWithConversion(accountType, path, ...params);
    }

    const newCdps = [...cdps];
    const closedCdpIndex = cdps.findIndex(_cdp => _cdp.id === cdp.id);
    newCdps.splice(closedCdpIndex, 1);

    const newCdp = newCdps.length > 0 ? newCdps[0] : null;

    addToLsState({ account, onboardingFinished: false, cdpId: newCdp ? newCdp.id : -1 });

    closeModal();

    if (newCdp === null) history.push('/create-cdp');
    else history.push('/dashboard/manage');

    dispatch({ type: CLOSE_CDP_SUCCESS, payload: { cdps: newCdps, cdp: newCdp } });
  } catch (err) {
    dispatch({ type: CLOSE_CDP_FAILURE, payload: err.message });
  }
};

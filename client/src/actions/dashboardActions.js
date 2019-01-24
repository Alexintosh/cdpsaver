import { change } from 'redux-form';
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
} from '../actionTypes/dashboardActionTypes';
import {
  approveDai, approveMaker, callProxyContract, transferCdp,
} from '../services/ethService';
import { getMaxDai, getMaxEthWithdraw, getUpdatedCdpInfo } from '../services/cdpService';
import { LS_ONBOARDING_FINISHED, MM_DENIED_TX_ERROR } from '../constants/general';

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
 * Handles redux actions for the generate dai smart contract call
 *
 * @param amountDai {String}
 * @return {Function}
 */
export const generateDaiAction = amountDai => async (dispatch, getState) => {
  dispatch({ type: GENERATE_DAI_REQUEST });

  try {
    const { cdp, account, proxyAddress, ethPrice } = getState().general; // eslint-disable-line
    const params = [amountDai, cdp.id, proxyAddress, account, 'draw', ethPrice];

    const payload = await callProxyContract(...params);

    dispatch({ type: GENERATE_DAI_SUCCESS, payload });
    dispatch(change('managerBorrowForm', 'generateDaiAmount', null));
    dispatch(getMaxDaiAction());
  } catch (err) {
    dispatch({ type: GENERATE_DAI_FAILURE, payload: err.message });
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
 * Handles redux actions for the withdraw eth from cdp smart contract call
 *
 * @param amountEth {String}
 * @return {Function}
 */
export const withdrawEthAction = amountEth => async (dispatch, getState) => {
  dispatch({ type: WITHDRAW_ETH_REQUEST });

  try {
    const { cdp, account, proxyAddress, ethPrice } = getState().general; // eslint-disable-line
    const params = [amountEth, cdp.id, proxyAddress, account, 'free', ethPrice];

    const payload = await callProxyContract(...params);

    dispatch({ type: WITHDRAW_ETH_SUCCESS, payload });
    dispatch(change('managerBorrowForm', 'withdrawEthAmount', null));
    dispatch(getMaxEthWithdrawAction());
  } catch (err) {
    dispatch({ type: WITHDRAW_ETH_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for the add eth collateral to the cdp smart contract call
 *
 * @param amountEth {String}
 *
 * @return {Function}
 */
export const addCollateralAction = amountEth => async (dispatch, getState) => {
  dispatch({ type: ADD_COLLATERAL_REQUEST });

  try {
    const { cdp, account, proxyAddress, ethPrice } = getState().general; // eslint-disable-line
    const params = [amountEth, cdp.id, proxyAddress, account, 'lock', ethPrice, true];

    const payload = await callProxyContract(...params);

    dispatch({ type: ADD_COLLATERAL_SUCCESS, payload });
    dispatch(change('managerPaybackForm', 'addCollateralAmount', null));
  } catch (err) {
    dispatch({ type: ADD_COLLATERAL_FAILURE, payload: err.message });
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

    const payload = {};

    if (type !== afterType) payload.afterType = type;

    if (type === 'generate') {
      payload.afterCdp = await getUpdatedCdpInfo(depositedEth, cdp.generatedDAI + amount, ethPrice);
    }

    if (type === 'withdraw') {
      payload.afterCdp = await getUpdatedCdpInfo(depositedEth - amount, cdp.generatedDAI, ethPrice);
    }

    if (type === 'collateral') {
      payload.afterCdp = await getUpdatedCdpInfo(depositedEth + amount, cdp.generatedDAI, ethPrice);
    }

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

  try {
    await approveDai(getState().general.account);

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

  try {
    await approveMaker(getState().general.account);

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

  try {
    const { account, cdp, proxyAddress } = getState().general;

    await transferCdp(account, toAddress, cdp.id, proxyAddress);

    localStorage.removeItem(LS_ONBOARDING_FINISHED);

    closeModal();
    dispatch({ type: TRANSFER_CDP_SUCCESS });

    history.push('/onboarding/create-cdp');
  } catch (err) {
    console.log('err', err);
    const payload = err.message.includes(MM_DENIED_TX_ERROR) ? '' : err.message;

    dispatch({ type: TRANSFER_CDP_FAILURE, payload });
  }
};
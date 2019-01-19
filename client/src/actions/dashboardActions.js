import { change } from 'redux-form';
import {
  GENERATE_DAI_REQUEST,
  GENERATE_DAI_SUCCESS,
  GENERATE_DAI_FAILURE,

  GET_MAX_DAI_REQUEST,
  GET_MAX_DAI_SUCCESS,
  GET_MAX_DAI_FAILURE,
} from '../actionTypes/dashboardActionTypes';
import { generateDai } from '../services/ethService';
import { getCdpInfo, getMaxDai, getUpdatedCdpInfo } from '../services/cdpService';

/**
 * Handles redux actions for the generate dai smart contract call
 *
 * @param amountDai {String}
 * @return {Function}
 */
export const generateDaiAction = amountDai => async (dispatch, getState) => {
  dispatch({ type: GENERATE_DAI_REQUEST });

  try {
    const {
      cdp, account, proxyAddress, ethPrice,
    } = getState().general;

    await generateDai(amountDai, cdp.id, proxyAddress, account);

    const newCdp = await getCdpInfo(cdp.id, false);
    const newCdpInfo = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);

    dispatch({ type: GENERATE_DAI_SUCCESS, payload: { ...newCdp, ...newCdpInfo } });
    dispatch(change('managerBorrowForm', 'generateDaiAmount', null));
  } catch (err) {
    dispatch({ type: GENERATE_DAI_FAILURE, payload: err.message });
  }
};

/**
 * Handles redux actions for when the number of max dai that can be generated is calculating
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

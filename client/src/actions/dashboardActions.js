import {
  GENERATE_DAI_REQUEST,
  GENERATE_DAI_SUCCESS,
  GENERATE_DAI_FAILURE,
} from '../actionTypes/dashboardActionTypes';
import { generateDai } from '../services/ethService';

/**
 * Handles redux actions for the generate dai smart contract call
 *
 * @param amountDai {String}
 * @return {Function}
 */
export const generateDaiAction = amountDai => async (dispatch, getState) => {
  dispatch({ type: GENERATE_DAI_REQUEST });

  try {
    await generateDai(amountDai, getState().general.address);

    dispatch({ type: GENERATE_DAI_SUCCESS });
  } catch (err) {
    dispatch({ type: GENERATE_DAI_FAILURE, payload: err });
  }
};

import {
  CREATE_CDP_REQUEST,
  CREATE_CDP_SUCCESS,
  CREATE_CDP_ERROR,

  RESET_ONBOARDING_WIZARD,
} from '../actionTypes/onboardingActionTypes';
import { createCdp } from '../services/cdpService';

/**
 * Resets the state of the onboarding reducer
 *
 * @return {Function}
 */
export const resetOnboardingWizard = () => (dispatch) => {
  dispatch({ type: RESET_ONBOARDING_WIZARD });
};

/**
 * Initiates the creation of the cdp from the cdp service and handles all redux logic for it
 *
 * @param ethAmount {String}
 * @param daiAmount {String}
 * @param history {Object}
 *
 * @return {Function}
 */
export const createCdpAction = ({ ethAmount, daiAmount }, history) => async (dispatch) => {
  dispatch({ type: CREATE_CDP_REQUEST });

  try {
    const payload = await createCdp(parseFloat(ethAmount), parseFloat(daiAmount));

    dispatch({ type: CREATE_CDP_SUCCESS, payload });
    history.push('/onboarding/wizard/info');
  } catch (err) {
    dispatch({ type: CREATE_CDP_ERROR, payload: err });
  }
};

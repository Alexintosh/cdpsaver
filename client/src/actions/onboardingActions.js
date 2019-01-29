import {
  CREATE_CDP_REQUEST,
  CREATE_CDP_SUCCESS,
  CREATE_CDP_ERROR,

  MONITORING_SUBSCRIBE_REQUEST,
  MONITORING_SUBSCRIBE_SUCCESS,
  MONITORING_SUBSCRIBE_FAILURE,

  RESET_ONBOARDING_WIZARD,

  FINISH_ONBOARDING,
} from '../actionTypes/onboardingActionTypes';
import { ADD_PROXY_ADDRESS } from '../actionTypes/generalActionTypes';
import { subscribeToMonitoringApiRequest } from '../services/apiService';
import { LS_ONBOARDING_FINISHED } from '../constants/general';
import { createCdp } from '../services/ethService';
import { getAddressCdp, getUpdatedCdpInfo } from '../services/cdpService';
import { sendTx } from './notificationsActions';

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
export const createCdpAction = ({ ethAmount, daiAmount }, history) => async (dispatch, getState) => {
  dispatch({ type: CREATE_CDP_REQUEST });

  const contractSendHandler = promise => sendTx(promise, 'Create CDP', dispatch, getState);

  try {
    const { account } = getState().general;

    await createCdp(contractSendHandler, account, ethAmount, parseFloat(daiAmount));

    // TODO SEE IF THIS CAN BE OPTIMIZED,
    const { cdp, proxyAddress } = await getAddressCdp(account);
    const newInfo = await getUpdatedCdpInfo(ethAmount, daiAmount);

    dispatch({ type: CREATE_CDP_SUCCESS, payload: { ...cdp, ...newInfo } });
    dispatch({ type: ADD_PROXY_ADDRESS, payload: proxyAddress });
    history.push('/onboarding/info');
  } catch (err) {
    dispatch({ type: CREATE_CDP_ERROR, payload: err });
  }
};

/**
 * Sends form values via API request to the server. Subscribes user to monitoring features
 *
 * @param formData {Object}
 *
 * @return {Function}
 */
export const submitOnboardingMonitoringForm = formData => async (dispatch) => {
  dispatch({ type: MONITORING_SUBSCRIBE_REQUEST });

  try {
    await subscribeToMonitoringApiRequest(formData);

    dispatch({ type: MONITORING_SUBSCRIBE_SUCCESS });
  } catch (err) {
    dispatch({ type: MONITORING_SUBSCRIBE_FAILURE, payload: err });
  }
};

/**
 * Adds some data to LS and moves the user to another page
 * @param history
 * @return {Function}
 */
export const finishOnboarding = history => (dispatch) => {
  localStorage.setItem(LS_ONBOARDING_FINISHED, JSON.stringify({ onboardingFinished: true }));
  dispatch({ type: FINISH_ONBOARDING });

  // TODO check if here the place the user is redirected to is the place he came from/ was he redirected to onboarding
  history.push('/dashboard/manage');
};

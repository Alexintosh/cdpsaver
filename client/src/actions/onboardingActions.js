import {
  CREATE_CDP_REQUEST,
  CREATE_CDP_SUCCESS,
  CREATE_CDP_ERROR,

  MONITORING_SUBSCRIBE_REQUEST,
  MONITORING_SUBSCRIBE_SUCCESS,
  MONITORING_SUBSCRIBE_FAILURE,

  RESET_ONBOARDING_WIZARD,

  SET_ONBOARDING_FINISHED,

  SET_CREATE_CDP_CALC_VALUES,
} from '../actionTypes/onboardingActionTypes';
import { ADD_PROXY_ADDRESS } from '../actionTypes/generalActionTypes';
import { subscribeToMonitoringApiRequest } from '../services/apiService';
import { createCdp } from '../services/ethService';
import { getAddressCdp, getUpdatedCdpInfo } from '../services/cdpService';
import { sendTx } from './notificationsActions';
import { addToLsState } from '../utils/utils';

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

    const { cdp, proxyAddress } = await getAddressCdp(account);
    const newInfo = await getUpdatedCdpInfo(ethAmount, daiAmount);

    dispatch({ type: CREATE_CDP_SUCCESS, payload: { ...cdp, ...newInfo } });
    dispatch({ type: ADD_PROXY_ADDRESS, payload: proxyAddress });
    history.push('/dashboard/manage');
  } catch (err) {
    dispatch({ type: CREATE_CDP_ERROR, payload: err });
  }
};

/**
 * Calculates the new ratio and liquidationPrice for the create CDP form
 *
 * @param _ethAmount {String}
 * @param _daiAmount {String}
 * @param ethPrice {Number}
 *
 * @return {Function}
 */
export const handleCreateCdpInputChange = (_ethAmount, _daiAmount, ethPrice) => async (dispatch) => {
  const ethAmount = parseFloat(_ethAmount);
  const daiAmount = parseFloat(_daiAmount);

  const setPayloadFalse = () => ({ liquidationPrice: 0, ratio: 0 });

  let payload = setPayloadFalse();

  if (!ethAmount || !daiAmount) return dispatch({ type: SET_CREATE_CDP_CALC_VALUES, payload });
  if ((ethAmount && ethAmount <= 0) || (daiAmount && daiAmount <= 0)) return dispatch({ type: SET_CREATE_CDP_CALC_VALUES, payload }); // eslint-disable-line

  payload = await getUpdatedCdpInfo(ethAmount, daiAmount, ethPrice);

  if (!payload.liquidationPrice || !payload.ratio) payload = setPayloadFalse();
  if ((payload.liquidationPrice && payload.liquidationPrice <= 0) || (payload.ratio && payload.ratio <= 0)) payload = setPayloadFalse(); // eslint-disable-line
  if (isNaN(payload.liquidationPrice) || isNaN(payload.ratio)) payload = setPayloadFalse(); // eslint-disable-line

  dispatch({ type: SET_CREATE_CDP_CALC_VALUES, payload });
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
export const finishOnboarding = history => (dispatch, getState) => {
  const { account } = getState().general;

  addToLsState({ account, onboardingFinished: true });
  dispatch({ type: SET_ONBOARDING_FINISHED, payload: true });

  history.push('/dashboard/manage');
};

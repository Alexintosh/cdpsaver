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
import { LS_ONBOARDING_FINISHED } from '../constants/general';
import { TRANSFER_CDP_SUCCESS } from '../actionTypes/dashboardActionTypes';

const lsOnboardingFinished = JSON.parse(localStorage.getItem(LS_ONBOARDING_FINISHED));

const INITIAL_STATE = {
  creatingCdp: false,
  creatingCdpError: null,

  subscribingToMonitoring: false,
  subscribingToMonitoringError: null,
  subscribingToMonitoringSuccess: false,

  cdpFormSubmitted: false,

  onboardingFinished: !!lsOnboardingFinished,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CDP_REQUEST:
      return { ...state, creatingCdp: true };

    case CREATE_CDP_SUCCESS:
      return { ...state, creatingCdp: false, cdpFormSubmitted: true };

    case CREATE_CDP_ERROR:
      return { ...state, creatingCdp: false, creatingCdpError: payload };

    case MONITORING_SUBSCRIBE_REQUEST:
      return { ...state, subscribingToMonitoring: true };

    case MONITORING_SUBSCRIBE_SUCCESS:
      return {
        ...state,
        subscribingToMonitoring: false,
        subscribingToMonitoringError: null,
        subscribingToMonitoringSuccess: true,
      };

    case MONITORING_SUBSCRIBE_FAILURE:
      return {
        ...state,
        subscribingToMonitoring: false,
        subscribingToMonitoringSuccess: false,
        subscribingToMonitoringError: payload,
      };

    case FINISH_ONBOARDING:
      return { ...state, onboardingFinished: true };

    case RESET_ONBOARDING_WIZARD:
      return { ...INITIAL_STATE, onboardingFinished: state.onboardingFinished };

    case TRANSFER_CDP_SUCCESS:
      return { ...INITIAL_STATE, onboardingFinished: false };

    default:
      return state;
  }
};

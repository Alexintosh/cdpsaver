import {
  CREATE_CDP_REQUEST,
  CREATE_CDP_SUCCESS,
  CREATE_CDP_ERROR,

  MONITORING_SUBSCRIBE_REQUEST,
  MONITORING_SUBSCRIBE_SUCCESS,
  MONITORING_SUBSCRIBE_FAILURE,

  RESET_ONBOARDING_WIZARD,
} from '../actionTypes/onboardingActionTypes';

const INITIAL_STATE = {
  creatingCdp: false,
  creatingCdpError: null,

  subscribingToMonitoring: false,
  subscribingToMonitoringError: null,
  subscribingToMonitoringSuccess: false,

  cdpFormSubmitted: false,
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

    case RESET_ONBOARDING_WIZARD:
      return INITIAL_STATE;

    default:
      return state;
  }
};

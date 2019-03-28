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
import { TRANSFER_CDP_SUCCESS } from '../actionTypes/dashboardActionTypes';
import { SELL_CDP_SUCCESS } from '../actionTypes/marketplaceActionTypes';

const INITIAL_STATE = {
  creatingCdp: false,
  creatingCdpError: null,

  newCdpLiquidationPrice: 0,
  newCdpRatio: 0,

  subscribingToMonitoring: false,
  subscribingToMonitoringError: null,
  subscribingToMonitoringSuccess: false,

  cdpFormSubmitted: false,

  onboardingFinished: false,
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

    case SET_ONBOARDING_FINISHED:
      return { ...state, onboardingFinished: payload };

    case RESET_ONBOARDING_WIZARD:
      return { ...INITIAL_STATE, onboardingFinished: !state.onboardingFinished };

    case SET_CREATE_CDP_CALC_VALUES:
      return {
        ...state,
        newCdpLiquidationPrice: payload.liquidationPrice,
        newCdpRatio: payload.ratio,
      };

    case TRANSFER_CDP_SUCCESS:
    case SELL_CDP_SUCCESS:
      return { ...INITIAL_STATE, onboardingFinished: false };

    default:
      return state;
  }
};

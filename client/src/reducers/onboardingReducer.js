import {
  CREATE_CDP_REQUEST,
  CREATE_CDP_SUCCESS,
  CREATE_CDP_ERROR,

  RESET_ONBOARDING_WIZARD,
} from '../actionTypes/onboardingActionTypes';

const INITIAL_STATE = {
  creatingCdp: false,
  creatingCdpError: null,

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

    case RESET_ONBOARDING_WIZARD:
      return INITIAL_STATE;

    default:
      return state;
  }
};

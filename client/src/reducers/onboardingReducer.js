import { RESET_ONBOARDING_WIZARD } from '../actionTypes/onboardingActionTypes';

const INITIAL_STATE = {
};

export default (state = INITIAL_STATE, action) => {
  const { type/* , payload */ } = action;

  switch (type) {
    case RESET_ONBOARDING_WIZARD:
      return INITIAL_STATE;

    default:
      return state;
  }
};

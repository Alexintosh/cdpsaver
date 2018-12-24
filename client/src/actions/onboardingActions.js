import { RESET_ONBOARDING_WIZARD } from '../actionTypes/onboardingActionTypes';

export const resetOnboardingWizard = () => (dispatch) => {
  dispatch({ type: RESET_ONBOARDING_WIZARD });
};

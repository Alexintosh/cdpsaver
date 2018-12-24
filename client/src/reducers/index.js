import { combineReducers } from 'redux';
import generalReducer from './generalReducer';
import onboardingReducer from './onboardingReducer';
import marketplaceReducer from './marketplaceReducer';

export default combineReducers({
  general: generalReducer,
  onboarding: onboardingReducer,
  marketplace: marketplaceReducer,
});

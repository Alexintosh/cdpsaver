import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import generalReducer from './generalReducer';
import onboardingReducer from './onboardingReducer';
import marketplaceReducer from './marketplaceReducer';

export default combineReducers({
  form: formReducer,
  general: generalReducer,
  onboarding: onboardingReducer,
  marketplace: marketplaceReducer,
});

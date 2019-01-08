import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import generalReducer from './generalReducer';
import onboardingReducer from './onboardingReducer';
import marketplaceReducer from './marketplaceReducer';
import modalReducer from './modalReducer';

export default combineReducers({
  form: formReducer,
  general: generalReducer,
  onboarding: onboardingReducer,
  marketplace: marketplaceReducer,
  modal: modalReducer,
});

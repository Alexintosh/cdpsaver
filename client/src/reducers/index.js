import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import generalReducer from './generalReducer';
import onboardingReducer from './onboardingReducer';
import marketplaceReducer from './marketplaceReducer';
import modalReducer from './modalReducer';
import notificationReducer from './notificationReducer';
import notificationsReducer from './notificationsReducer';
import dashboardReducer from './dashboardReducer';
import migrateReducer from './migrateReducer';

export default combineReducers({
  form: formReducer,
  general: generalReducer,
  onboarding: onboardingReducer,
  marketplace: marketplaceReducer,
  modal: modalReducer,
  notification: notificationReducer,
  notifications: notificationsReducer,
  dashboard: dashboardReducer,
  migrate: migrateReducer,
});

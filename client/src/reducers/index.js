import { combineReducers } from 'redux';
import generalReducer from './generalReducer';
import marketplaceReducer from './marketplaceReducer';

export default combineReducers({
  general: generalReducer,
  marketplace: marketplaceReducer,
});

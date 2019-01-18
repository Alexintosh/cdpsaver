import {
  GENERATE_DAI_REQUEST,
  GENERATE_DAI_SUCCESS,
  GENERATE_DAI_FAILURE,
} from '../actionTypes/dashboardActionTypes';

const INITIAL_STATE = {
  generatingDai: false,
  generatingDaiError: '',
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case GENERATE_DAI_REQUEST:
      return { ...state, generatingDai: true };

    case GENERATE_DAI_SUCCESS:
      return {
        ...state,
        generatingDai: false,
        generatingDaiError: '',
      };

    case GENERATE_DAI_FAILURE:
      return {
        ...state,
        generatingDai: false,
        generatingDaiError: payload,
      };

    default:
      return state;
  }
};

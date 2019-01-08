import {
  GET_MARKETPLACE_CDP_DATA_REQUEST, GET_MARKETPLACE_CDP_DATA_SUCCESS, GET_MARKETPLACE_CDP_DATA_FAILURE,
} from '../actionTypes/marketplaceActionTypes';

const INITIAL_STATE = {
  cdps: [],
  fetchingCdps: false,
  fetchingCdpsError: '',
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MARKETPLACE_CDP_DATA_REQUEST:
      return { ...state, fetchingCdps: true };

    case GET_MARKETPLACE_CDP_DATA_SUCCESS:
      return {
        ...state,
        fetchingCdps: false,
        fetchingCdpsError: '',
        cdps: payload,
      };

    case GET_MARKETPLACE_CDP_DATA_FAILURE:
      return { ...state, fetchingCdps: false, fetchingCdpsError: payload };

    default:
      return state;
  }
};

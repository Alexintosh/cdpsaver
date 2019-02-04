import {
  GET_MARKETPLACE_CDP_DATA_REQUEST,
  GET_MARKETPLACE_CDP_DATA_SUCCESS,
  GET_MARKETPLACE_CDP_DATA_FAILURE,

  SELL_CDP_REQUEST,
  SELL_CDP_SUCCESS,
  SELL_CDP_FAILURE,
  RESET_SELL_CDP_FORM,

  BUY_CDP_REQUEST,
  BUY_CDP_SUCCESS,
  BUY_CDP_FAILURE,
} from '../actionTypes/marketplaceActionTypes';

const INITIAL_STATE = {
  cdps: [],
  fetchingCdps: false,
  fetchingCdpsError: '',

  sellingCdp: false,
  sellingCdpError: '',
  sellingCdpSuccess: false,

  buyingCdp: false,
  buyingCdpError: false,
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

    case SELL_CDP_REQUEST:
      return { ...state, sellingCdp: true };

    case SELL_CDP_SUCCESS:
      return {
        ...state,
        sellingCdp: false,
        sellingCdpError: '',
        sellingCdpSuccess: true,
      };

    case SELL_CDP_FAILURE:
      return {
        ...state,
        sellingCdp: false,
        sellingCdpSuccess: false,
        sellingCdpError: payload,
      };

    case RESET_SELL_CDP_FORM:
      return {
        ...state,
        sellingCdp: false,
        sellingCdpError: '',
        sellingCdpSuccess: false,
      };

    case BUY_CDP_REQUEST:
      return { ...state, buyingCdp: true };

    case BUY_CDP_SUCCESS:
      return {
        ...state,
        buyingCdp: false,
        buyingCdpError: '',
      };

    case BUY_CDP_FAILURE:
      return {
        ...state,
        buyingCdp: false,
        buyingCdpError: payload,
      };

    default:
      return state;
  }
};

import {
  GET_MARKETPLACE_CDP_DATA_REQUEST,
  GET_MARKETPLACE_CDP_DATA_SUCCESS,
  GET_MARKETPLACE_CDP_DATA_FAILURE,
} from '../actionTypes/marketplaceActionTypes';
import { getCdpInfos } from '../services/cdpService';

/**
 * Dispatches action to save formatted Cdp data for an array of added cdp ids
 * @return {Function}
 */
export const getMarketplaceCdpsData = () => async (dispatch) => {
  const mockCdpIds = [3613, 3615, 3617, 3618, 3650];
  dispatch({ type: GET_MARKETPLACE_CDP_DATA_REQUEST });

  try {
    const payload = await getCdpInfos(mockCdpIds);

    dispatch({ type: GET_MARKETPLACE_CDP_DATA_SUCCESS, payload });
  } catch (err) {
    dispatch({ type: GET_MARKETPLACE_CDP_DATA_FAILURE, payload: err });
  }
};

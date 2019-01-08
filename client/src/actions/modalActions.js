import { TOGGLE_MODAL } from '../actionTypes/modalActionTypes';
import {
  SELL_CDP_MODAL,
} from '../components/Modals/modalTypes';

/**
 * Dispatches action to toggle modal.
 *
 * @param {String} modalType
 * @param {Object} modalProps
 * @param {Boolean} action - to close or to open
 */
export const toggleModal = (modalType, modalProps, action) => (dispatch) => {
  dispatch({
    type: TOGGLE_MODAL,
    payload: { modalType, modalProps, action },
  });
};

/**
 * Closes the modal that is currently open
 */
export const closeModal = () => (dispatch) => {
  dispatch({
    type: TOGGLE_MODAL,
    payload: { modalType: '', modalProps: {}, action: false },
  });
};

/**
 * Opens confirm remove modal when player wants to remove a panel
 */
export const openSellCdpModal = () => (dispatch) => {
  dispatch(toggleModal(SELL_CDP_MODAL, { width: 750 }, true));
};

import { TOGGLE_MODAL } from '../actionTypes/modalActionTypes';
import {
  SELL_CDP_MODAL,
  CLOSE_CDP_MODAL,
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

/**
 * Checks if the modal should be opened or if the tx can be sent right away
 * If it can't be spent then it opens the modal
 */
export const openCloseCdpModal = () => async (dispatch) => {
  dispatch(toggleModal(CLOSE_CDP_MODAL, { width: 481 }, true));
};

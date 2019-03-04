import { TOGGLE_MODAL } from '../actionTypes/modalActionTypes';
import {
  SELL_CDP_MODAL,
  CLOSE_CDP_MODAL,
  TRANSFER_CDP_MODAL,
  CANCEL_SELL_CDP_MODAL,
  REPAY_MODAL,
  BOOST_MODAL,
  PAYBACK_CDP_MODAL,
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
 * Opens confirm remove modal when the user wants to sell his cdp
 */
export const openSellCdpModal = () => (dispatch) => {
  dispatch(toggleModal(SELL_CDP_MODAL, { width: 750 }, true));
};

/**
 * Opens close cdp modal when the user wants to close his cdp
 */
export const openCloseCdpModal = history => (dispatch) => {
  dispatch(toggleModal(CLOSE_CDP_MODAL, { history, width: 481 }, true));
};

/**
 * Opens the transfer cdp modal when the user whats to send it someone else
 *
 * @param {Object} history
 */
export const openTransferCdpModal = history => (dispatch) => {
  dispatch(toggleModal(TRANSFER_CDP_MODAL, { width: 481, history }, true));
};

/**
 * Opens confirm cancel modal when the user wants to cancel the sale of his cdp
 */
export const openCancelSellCdplModal = () => (dispatch) => {
  dispatch(toggleModal(CANCEL_SELL_CDP_MODAL, { width: 481 }, true));
};

/**
 * Opens the repay modal where the user confirms if he wants to proceed
 *
 * @param {Number} ethAmount
 */
export const openRepayModal = ethAmount => async (dispatch) => {
  dispatch(toggleModal(REPAY_MODAL, { width: 481, ethAmount }, true));
};

/**
 * Opens the boost modal where the user confirms if he wants to proceed
 *
 * @param {Number} boostAmount
 */
export const openBoostModal = boostAmount => async (dispatch) => {
  dispatch(toggleModal(BOOST_MODAL, { width: 481, boostAmount }, true));
};

/**
 * Opens the payback cdp modal when the user wants to payback a part of his debt
 *
 * @param paybackAmount {String}
 *
 */
export const openPaybackModal = paybackAmount => async (dispatch) => {
  dispatch(toggleModal(PAYBACK_CDP_MODAL, { width: 481, paybackAmount }, true));
};

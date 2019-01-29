import { ADD_NOTIFICATION, CLOSE_NOTIFICATION } from '../actionTypes/notificationsActionTypes';

/**
 * Adds a tx notification to the right corner of the app
 *
 * @return {Function}
 */
export const addNotification = () => (dispatch) => {
  const payload = {
    id: 0,
    type: 'loading',
    title: 'Payback 0.1 DAI',
    description: 'Waiting for transaction signature....',
  };

  dispatch({ type: ADD_NOTIFICATION, payload });
};

/**
 * Closes a tx if the tx is still present
 *
 * @param id {Number}
 *
 * @return {Function}
 */
export const closeNotification = id => (dispatch, getState) => {
  const notifications = [...getState().notifications.notifications];
  const index = notifications.findIndex(notif => notif.id === id);

  if (index < 0) return;

  notifications.splice(index, 1);

  dispatch({ type: CLOSE_NOTIFICATION, payload: notifications });
};

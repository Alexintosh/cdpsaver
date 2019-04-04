import {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION,
  CHANGE_NOTIFICATION,
} from '../actionTypes/notificationsActionTypes';

/**
 * Adds a tx notification to the right corner of the app
 *
 * @return {Function}
 */
export const addNotification = (id, type, title, description, hash = '') => (dispatch) => {
  const payload = {
    id, type, title, description, hash,
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

export const changeNotification = (id, changes) => (dispatch, getState) => {
  const notifications = [...getState().notifications.notifications];
  const index = notifications.findIndex(notif => notif.id === id);

  if (index < 0) return;

  notifications.splice(index, 1, { ...notifications[index], ...changes });

  dispatch({ type: CHANGE_NOTIFICATION, payload: notifications });
};

/**
 * Handles a transactions status in the notification
 *
 * @param _txPromise {Promise}
 * @param title {String}
 * @param dispatch {Function}
 * @param getState {Function}
 * @param waitForSign {Boolean}
 *
 * @return {Promise<any>}
 */
export const sendTx = (
  _txPromise, title, dispatch, getState, waitForSign = false,
) => new Promise(async (resolve, reject) => {
  const id = getState().notifications.notifications.length;
  let txPromise = _txPromise;

  const formatTx = hash => `${hash.slice(0, 8)}...`;
  const closeThisNotification = () => { setTimeout(() => { dispatch(closeNotification(id)); }, 3000); };
  const handleError = (err) => {
    let errorMessage = 'Error occurred';

    if (err) {
      if (err.message) errorMessage = err.message;
      if (typeof err === 'string') errorMessage = err;
    }

    dispatch(changeNotification(id, { tx: '', type: 'error', description: errorMessage }));
    closeThisNotification();

    reject(err);
  };

  dispatch(addNotification(id, 'loading', title, 'Waiting for transaction signature...'));

  try {
    // This is here because trezor and ledger return the tx promise after the sign promise
    if (waitForSign) {
      const transactionHash = await txPromise;
      txPromise = window._web3.eth.sendSignedTransaction(transactionHash);
    }

    txPromise
      .on('transactionHash', (hash) => {
        const description = `Transaction ${formatTx(hash)} was created. Waiting for confirmation`;

        dispatch(changeNotification(id, { tx: hash, description }));
      })
      .on('receipt', (receipt) => {
        const { transactionHash } = receipt;
        const description = `Transaction ${formatTx(transactionHash)} was confirmed`;

        dispatch(changeNotification(id, { type: 'success', description }));
        closeThisNotification();

        resolve(receipt);
      })
      .on('error', handleError);
  } catch (err) {
    handleError(err);
  }
});

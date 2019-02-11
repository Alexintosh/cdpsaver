import {
  MIGRATE_CDP_REQUEST,
  MIGRATE_CDP_SUCCESS,
  MIGRATE_CDP_FAILURE,
  MIGRATE_CDP_RESET,
} from '../actionTypes/migrateActionsTypes';
import { createDSProxy, migrateCdp } from '../services/ethService';
import { sendTx } from './notificationsActions';
import { ADD_PROXY_ADDRESS } from '../actionTypes/generalActionTypes';
import { getCdp } from './accountActions';
import { proxyRegistryInterfaceContract } from '../services/contractRegistryService';

/**
 * Resets the state on the migrate cdp page
 *
 * @return {Function}
 */
export const resetMigrateCdp = () => (dispatch) => { dispatch({ type: MIGRATE_CDP_RESET }); };

/**
 * Checks if the account has a proxyAddress if it doesn't then it is first created then
 * the cdp is transferred to that proxyAddress. If it does exist it is immediately transferred to the
 * existing proxy address
 *
 * @param cdp {Object}
 * @return {Function}
 */
export const migrateCdpAction = cdp => async (dispatch, getState) => {
  const createDSNotificationFunc = promise => sendTx(promise, 'Create DS Proxy', dispatch, getState);
  const migrateCDPNotificationFunc = promise => sendTx(promise, 'Migrate CDP', dispatch, getState);

  const { account } = getState().general;
  let { proxyAddress } = getState().general;

  dispatch({ type: MIGRATE_CDP_REQUEST });

  try {
    if (!proxyAddress) {
      await createDSProxy(createDSNotificationFunc, account);
      proxyAddress = await proxyRegistryInterfaceContract().methods.proxies(account).call();
    }

    await migrateCdp(migrateCDPNotificationFunc, cdp.id, proxyAddress, account);

    dispatch({ type: MIGRATE_CDP_SUCCESS });
    dispatch({ type: ADD_PROXY_ADDRESS, payload: proxyAddress });

    dispatch(getCdp());
  } catch (err) {
    dispatch({ type: MIGRATE_CDP_FAILURE, payload: err.message });
  }
};

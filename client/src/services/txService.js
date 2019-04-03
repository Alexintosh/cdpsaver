import { signAndSendTrezor } from './trezorService';

/**
 * Calls the contract method via the web3 contract api
 *
 * @param notificationFunc {Function}
 * @param contract {Function}
 * @param contractFunc {String}
 * @param funcParams {Array}
 * @param txParams {Object}
 *
 * @return {Promise}
 */
const callMetaMaskTx = (
  notificationFunc, contract, contractFunc, funcParams, txParams,
) => new Promise(async (resolve, reject) => {
  try {
    const promise = contract.methods[contractFunc](...funcParams).send(txParams);

    await notificationFunc(promise);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls the contract method via the web3 sendSignedTransaction api
 *
 * @param path {String}
 * @param notificationFunc {Function}
 * @param contract {Function}
 * @param contractFunc {String}
 * @param funcParams {Array}
 * @param txParams {Object}
 *
 * @return {Promise}
 */
export const callTrezorTx = (
  path, notificationFunc, contract, contractFunc, funcParams, txParams,
) => new Promise(async (resolve, reject) => {
  try {
    const value = txParams.value || '0';

    const tx = await signAndSendTrezor(contract, contractFunc, funcParams, value, txParams.from, path);

    await notificationFunc(window._web3.eth.sendSignedTransaction(tx));

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

const callTx = (type, path, ...args) => {
  try {
    if (type === 'metamask') return callMetaMaskTx(...args);
    if (type === 'trezor') return callTrezorTx(path, ...args);
  } catch (err) {
    throw new Error(err);
  }
};

export default callTx;

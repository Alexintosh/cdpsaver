import Tx from 'ethereumjs-tx';
import clientConfig from '../config/clientConfig.json';
import TrezorConnect from './trezor-connect';

const trezor = TrezorConnect;

let lastNonce = 0;

let currentlySendingLock = false;

/**
 * Gets the address for the trezor wallet
 *
 * @param path {String}
 *
 * @return {Promise<String>}
 */
export const trezorGetAccount = path => new Promise(async (resolve, reject) => {
  try {
    const response = await trezor.ethereumGetAddress({ path });

    if (!response.success) return reject(response.payload.error);

    lastNonce = 0;

    resolve(response.payload.address.toLowerCase());
  } catch (e) {
    reject(e.message);
  }
});

/**
 * Regulates when multiple transactions are called
 *
 * @return {Promise<void>}
 */
const waitForLock = async () => {
  while (currentlySendingLock) await new Promise(res => setTimeout(res, 50)); // eslint-disable-line
  currentlySendingLock = true;
};

/**
 * Formats and executes the transaction for the trezor wallet
 *
 * @param contract
 * @param action {String}
 * @param args {Array}
 * @param value {Number}
 * @param address {String}
 * @param path {String}
 *
 * @return {Promise<*>}
 */
export const signAndSendTrezor = (
  contract, action, args, value, address, path,
) => new Promise(async (resolve, reject) => {
  await waitForLock();
  try {
    const contractCall = contract.methods[action](...args);
    const encodedAbi = contractCall.encodeABI();

    const currentNonce = await window._web3.eth.getTransactionCount(address);
    if (currentNonce > lastNonce) lastNonce = currentNonce;

    const rawTx = {
      nonce: window._web3.utils.numberToHex(lastNonce),
      from: address,
      to: contractCall._parent._address,
      data: encodedAbi,
      value: window._web3.utils.numberToHex(value),
    };

    const gasLimit = await window._web3.eth.estimateGas(rawTx);
    rawTx.gasLimit = window._web3.utils.numberToHex(gasLimit + 20000);

    const gasPrice = await window._web3.eth.getGasPrice();
    rawTx.gasPrice = window._web3.utils.numberToHex(gasPrice);

    rawTx.chainId = clientConfig.network;

    const response = await trezor.ethereumSignTransaction({ path, transaction: rawTx });

    if (!response.success) {
      reject(response.payload.error);
      return;
    }

    const signedTx = response.payload;

    const tx2 = new Tx({
      ...rawTx,
      ...signedTx,
    });

    lastNonce += 1;

    resolve(`0x${tx2.serialize().toString('hex')}`);
  } catch (err) {
    reject(err);
  } finally {
    currentlySendingLock = false;
  }
});

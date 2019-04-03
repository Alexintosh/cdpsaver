import Tx from 'ethereumjs-tx';
import config from '../config/clientConfig.json';
import TrezorConnect from './trezor-connect';

const trezor = TrezorConnect;

const defaultPath = "m/44'/60'/0'/0/0";
let trezorPath = defaultPath;

let lastNonce = 0;

let currentlySendingLock = false;

/**
 * Gets the address for the trezor wallet
 *
 * @param path {String}
 *
 * @return {Promise<String>}
 */
export const trezorGetAccount = async (path = defaultPath) => new Promise(async (resolve, reject) => {
  try {
    trezorPath = path;

    const response = await trezor.ethereumGetAddress({ path: trezorPath });

    if (!response.success) return reject(response.payload.error);

    resolve(response.payload.address.toLowerCase());
  } catch (e) {
    reject(e.message);
  }
});

const waitForLock = async () => {
  while (currentlySendingLock) await new Promise(res => setTimeout(res, 50)); // eslint-disable-line
  currentlySendingLock = true;
};

/**
 * Formats abd executes the transaction for the trezor wallet
 *
 * @param contract
 * @param action {String}
 * @param args {Array}
 * @param value {Number}
 * @param address {String}
 *
 * @return {Promise<*>}
 */
export const signAndSendTrezor = async (contract, action, args, value, address) => {
  await waitForLock();
  try {
    const contractCall = contract.methods[action](...args);

    const encodedAbi = contractCall.encodeABI();
    console.log(`TREZOR encodedAbi ${encodedAbi}`);

    const currentNonce = await window._web3.eth.getTransactionCount(address);
    if (currentNonce > lastNonce) lastNonce = currentNonce;
    const nonce = lastNonce;
    console.log(`TREZOR nonce ${nonce}`);

    const rawTx = {
      nonce: window._web3.utils.numberToHex(nonce),
      from: address,
      to: contractCall._parent._address,
      data: encodedAbi,
      value: window._web3.utils.numberToHex(value),
    };

    console.log('rawTx', rawTx);
    const gasLimit = await window._web3.eth.estimateGas(rawTx);
    rawTx.gasLimit = window._web3.utils.numberToHex(gasLimit + 20000);

    const gasPrice = await window._web3.eth.getGasPrice();
    rawTx.gasPrice = window._web3.utils.numberToHex(gasPrice);

    rawTx.chainId = config.network;

    console.log('TREZOR rawTx', rawTx);

    const response = await trezor.ethereumSignTransaction({
      path: "m/44'/60'/0'/0/0",
      transaction: rawTx,
    });
    console.log('response', response);

    if (!response.success) throw new Error(response.payload.error);

    const signedTx = response.payload;
    console.log('TREZOR signedTx', signedTx);

    const tx2 = new Tx({
      ...rawTx,
      ...signedTx,
    });
    console.log('TREZOR tx2', tx2);

    lastNonce += 1;
    console.log('TREZOR incrementing nonce');

    return window._web3.eth.sendSignedTransaction(`0x${tx2.serialize().toString('hex')}`)
      .on('transactionHash', (hash) => {
        console.log('HASH', hash);
      });
  } catch (err) {
    console.log('ERROR', err);
  } finally {
    console.log('TREZOR releasing lock');
    currentlySendingLock = false;
  }
};

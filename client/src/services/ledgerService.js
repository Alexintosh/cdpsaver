import Tx from 'ethereumjs-tx';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Eth from '@ledgerhq/hw-app-eth';
import clientConfig from '../config/clientConfig.json';

let lastNonce = 0;

let currentlySendingLock = false;

/**
 * Lists all accounts
 *
 * @param type {String}
 * @param start {Number}
 * @param n {Number}
 * @param path {String}
 *
 * @return {Promise<Array>}
 */
export const listAccounts = async (type, start, n, path) => {
  const _transport = await TransportU2F.create();
  const eth = new Eth(_transport);
  const accounts = [];

  if (type === 'legacy') {
    for (let i = 0; i < n; i += 1) {
      const currentPath = `44'/60'/0'/${start + i}`;
      const account = await eth.getAddress(currentPath); // eslint-disable-line
      account.path = currentPath;
      accounts.push(account);
    }
  } else if (type === 'live') {
    for (let i = 0; i < n; i += 1) {
      const currentPath = `44'/60'/${start + i}'/0/0`;
      const account = await eth.getAddress(currentPath); // eslint-disable-line
      account.path = currentPath;
      accounts.push(account);
    }
  } else {
    const account = await eth.getAddress(path);
    account.path = path;
    accounts.push(account);
  }
  return accounts;
};

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
export const signAndSendLedger = (
  contract, action, args, value, address, path,
) => new Promise(async (resolve, reject) => {
  await waitForLock();

  try {
    const _transport = await TransportU2F.create();
    const eth = new Eth(_transport);

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
    rawTx.gasLimit = window._web3.utils.numberToHex(gasLimit);

    const gasPrice = await window._web3.eth.getGasPrice();
    rawTx.gasPrice = window._web3.utils.numberToHex(gasPrice);

    rawTx.chainId = clientConfig.network;
    rawTx.v = clientConfig.network;

    const tx = new Tx(rawTx);

    const signedTx = await eth.signTransaction(path, tx.serialize().toString('hex'));

    const tx2 = new Tx({
      ...rawTx,
      v: `0x${signedTx.v}`,
      r: `0x${signedTx.r}`,
      s: `0x${signedTx.s}`,
    });

    lastNonce += 1;

    resolve(`0x${tx2.serialize().toString('hex')}`);
  } catch (err) {
    reject(err);
  } finally {
    currentlySendingLock = false;
  }
});

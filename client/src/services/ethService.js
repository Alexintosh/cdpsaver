import {
  SaiSaverProxyContract,
  proxyRegistryInterfaceAddress,
  tubInterfaceAddress,
  saiTubAddress,
  saiSaverProxyAddress,
} from './contractRegistryService';
import config from '../config/config.json';
import { numStringToBytes32 } from '../utils/utils';
import dsProxyContractJson from '../contracts/DSProxy.json';

export const getAccount = () => (
  new Promise(async (resolve, reject) => {
    try {
      const accounts = await window._web3.eth.getAccounts();
      if (!accounts.length) throw new Error('No accounts (Possibly locked)');
      resolve(accounts[0]);
    } catch (err) {
      reject(err);
    }
  })
);

export const getBalance = async (_account) => {
  const account = _account || await getAccount();
  const balanceWei = await window._web3.eth.getBalance(account);
  const balanceEth = window._web3.utils.fromWei(balanceWei);
  // optionally convert to BigNumber here
  // return new window._web3.utils.BN(balanceEth);
  return balanceEth;
};

export const weiToEth = weiVal => window._web3.utils.fromWei(new window._web3.utils.BN(`${weiVal}`));

export const ethToWei = ethVal => window._web3.utils.toWei(`${ethVal}`);

export const getBlockNumber = () => window._web3.eth.getBlockNumber();

export const getNetwork = () => window._web3.eth.net.getId();

/**
 * Returns name of Ethereum network for given ID
 *
 * @return {String}
 */
export const nameOfNetwork = (networkId) => {
  const networks = {
    1: 'Mainnet',
    3: 'Ropsten',
    4: 'Rinkedby',
    42: 'Kovan',
  };
  return networks[networkId] || 'Unknown network';
};

/**
 * Checks if the user has approved to use MM as the provider
 *
 * @return {Promise<*>}
 */
export const isMetaMaskApproved = async () => {
  if (!window.ethereum || !window.ethereum.enable) return true;
  if (window.ethereum._metamask && window.ethereum._metamask.isApproved) return window.ethereum._metamask.isApproved();

  const acc = await window.web3.eth.getAccounts();

  return !!acc.length;
};

export const metamaskApprove = async () => {
  try {
    if (window.ethereum) return window.ethereum.enable();
  } catch (e) {
    throw new Error((e));
  }
};

/**
 * Calls the SaiSaverProxy contract and sends params to create the cdp
 *
 * @param from {String}
 * @param ethAmount {String}
 * @param _daiAmount {Number}
 *
 * @return {Promise<Boolean>}
 */
export const createCdp = (from, ethAmount, _daiAmount) => new Promise(async (resolve, reject) => {
  const address1 = proxyRegistryInterfaceAddress;
  const address2 = tubInterfaceAddress;

  try {
    const contract = await SaiSaverProxyContract();
    const params = { from, value: window._web3.utils.toWei(ethAmount, 'ether') };
    const daiAmount = window._web3.utils.toWei(_daiAmount.toString(), 'ether');

    contract.methods.createOpenLockAndDraw(address1, address2, daiAmount).send(params)
      .on('confirmation', () => { resolve(true); })
      .on('error', reject);
  } catch (err) {
    console.log('ERROR', err);
    reject(err);
  }
});


/**
 * Calls the proxy contract and generates more dai for it
 *
 * @param amountDai {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
 *
 * @return {Promise<Boolean>}
 */
export const generateDai = (amountDai, cdpId, proxyAddress, account) => new Promise(async (resolve, reject) => {
  const web3 = window._web3;

  try {
    const contract = config.SaiSaverProxy;
    const contractFunction = contract.abi.find(abi => abi.name === 'draw');

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const daiParam = web3.utils.toWei(amountDai, 'ether');
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const data = web3.eth.abi.encodeFunctionCall(contractFunction, [saiTubAddress, cdpIdBytes32, daiParam]);

    await proxyContract.methods['execute(address,bytes)'](saiSaverProxyAddress, data).send({ from: account });

    resolve(true);
  } catch (err) {
    reject(err.message);
  }
});

/**
 * Calls the proxy contract and withdraws eth for it
 *
 * @param amountEth {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
 *
 * @return {Promise<Boolean>}
 */
export const withdrawEthFromCdp = (amountEth, cdpId, proxyAddress, account) => new Promise(async (resolve, reject) => {
  const web3 = window._web3;

  try {
    const contract = config.SaiSaverProxy;
    const contractFunction = contract.abi.find(abi => abi.name === 'free');

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const ethParam = web3.utils.toWei(amountEth, 'ether');
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const data = web3.eth.abi.encodeFunctionCall(contractFunction, [saiTubAddress, cdpIdBytes32, ethParam]);

    await proxyContract.methods['execute(address,bytes)'](saiSaverProxyAddress, data).send({ from: account });

    resolve(true);
  } catch (err) {
    reject(err.message);
  }
});

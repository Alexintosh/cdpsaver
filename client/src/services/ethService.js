import {
  SaiSaverProxyContract,
  proxyRegistryInterfaceAddress,
  tubInterfaceAddress,
  saiTubAddress,
  saiSaverProxyAddress,
  DaiErc20Contract,
  MakerErc20Contract,
} from './contractRegistryService';
import config from '../config/config.json';
import { numStringToBytes32 } from '../utils/utils';
import dsProxyContractJson from '../contracts/DSProxy.json';
import { getCdpInfo, getUpdatedCdpInfo } from './cdpService';

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
 * Calls the proxy contract and handles the action that is specified in the parameters
 *
 * @param amount {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
2 * @param funcName {String}
 * @param ethPrice {Number}
 * @param sendAsValue {Boolean}
 *
 * @return {Promise<Object>}
 */
export const callProxyContract = (
  amount, cdpId, proxyAddress, account, funcName, ethPrice, sendAsValue = false,
) => new Promise(async (resolve, reject) => {
  const web3 = window._web3;

  try {
    const contract = config.SaiSaverProxy;
    const contractFunction = contract.abi.find(abi => abi.name === funcName);

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const amountParam = web3.utils.toWei(amount, 'ether');
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const params = [saiTubAddress, cdpIdBytes32];
    const txParams = { from: account };

    if (sendAsValue) {
      txParams.value = amountParam;
    } else {
      params.push(amountParam);
    }

    const data = web3.eth.abi.encodeFunctionCall(contractFunction, params);

    await proxyContract.methods['execute(address,bytes)'](saiSaverProxyAddress, data).send(txParams);

    const newCdp = await getCdpInfo(cdpId, false);
    const newCdpInfo = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);

    resolve({ ...newCdp, ...newCdpInfo });
  } catch (err) {
    reject(err.message);
  }
});

export const getDaiAllowance = address => new Promise(async (resolve, reject) => {
  const contract = await DaiErc20Contract();

  try {
    const data = await contract.methods.allowance(address, tubInterfaceAddress).call();

    resolve(parseFloat(weiToEth(data)));
  } catch (err) {
    reject(err);
  }
});

export const getDaiBalance = address => new Promise(async (resolve, reject) => {
  const contract = await DaiErc20Contract();

  try {
    const data = await contract.methods.balanceOf(address).call();

    resolve(parseFloat(data));
  } catch (err) {
    reject(err);
  }
});

export const getMakerAllowance = address => new Promise(async (resolve, reject) => {
  const contract = await MakerErc20Contract();

  try {
    const data = await contract.methods.allowance(address, tubInterfaceAddress).call();

    resolve(parseFloat(weiToEth(data)));
  } catch (err) {
    reject(err);
  }
});

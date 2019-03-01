import {
  SaiSaverProxyContract,
  proxyRegistryInterfaceAddress,
  tubInterfaceAddress,
  saiTubAddress,
  saiSaverProxyAddress,
  DaiErc20Contract,
  MakerErc20Contract,
  marketplaceContract,
  marketplaceAddress,
  marketplaceProxyAddress,
  proxyRegistryInterfaceContract,
  TubInterfaceContract,
  KyberNetworkProxyContract,
  ethTokenAddress,
  daiTokenAddress,
  saverProxyAddress,
  PipInterfaceContract,
  SaverProxyContract,
} from './contractRegistryService';
import config from '../config/config.json';
import { isEmptyBytes, numStringToBytes32 } from '../utils/utils';
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

export const createCdp = (sendTxFunc, from, ethAmount, _daiAmount) => new Promise(async (resolve, reject) => {
  const address1 = proxyRegistryInterfaceAddress;
  const address2 = tubInterfaceAddress;

  try {
    const contract = await SaiSaverProxyContract();
    const params = { from, value: window._web3.utils.toWei(ethAmount, 'ether') };
    const daiAmount = window._web3.utils.toWei(_daiAmount.toString(), 'ether');

    const promise = contract.methods.createOpenLockAndDraw(address1, address2, daiAmount).send(params);
    await sendTxFunc(promise);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls the proxy contract and handles the action that is specified in the parameters
 *
 * @param sendTxFunc {Function}
 * @param amount {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
 * @param funcName {String}
 * @param ethPrice {Number}
 * @param sendAsValue {Boolean}
 * @param sendEmptyAddress {Boolean}
 *
 * @return {Promise<Object>}
 */
export const callProxyContract = (
  sendTxFunc,
  amount, cdpId, proxyAddress, account, funcName, ethPrice, sendAsValue = false, sendEmptyAddress = false,
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

    if (sendEmptyAddress) params.push('0x0000000000000000000000000000000000000000');

    const data = web3.eth.abi.encodeFunctionCall(contractFunction, params);

    const promise = proxyContract.methods['execute(address,bytes)'](saiSaverProxyAddress, data).send(txParams);
    await sendTxFunc(promise, amount);

    const newCdp = await getCdpInfo(cdpId, false);
    const newCdpInfo = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);

    resolve({ ...newCdp, ...newCdpInfo });
  } catch (err) {
    reject(err.message);
  }
});

/**
 * Gets dai allowance for the users address from the dai erc20 contract
 *
 * @param address {String}
 * @return {Promise<Number>}
 */
export const getDaiAllowance = address => new Promise(async (resolve, reject) => {
  const contract = await DaiErc20Contract();

  try {
    const data = await contract.methods.allowance(address, tubInterfaceAddress).call();

    resolve(parseFloat(weiToEth(data)));
  } catch (err) {
    reject(err);
  }
});

/**
 * Gets dai balance for the users address from the dai erc20 contract
 *
 * @param address {String}
 * @return {Promise<Number>}
 */
export const getDaiBalance = address => new Promise(async (resolve, reject) => {
  const contract = await DaiErc20Contract();

  try {
    const data = await contract.methods.balanceOf(address).call();

    resolve(parseFloat(data));
  } catch (err) {
    reject(err);
  }
});

/**
 * Approves that dai can be used for the users address on the dai erc20 contract
 *
 * @param address {String}
 * @return {Promise<Boolean>}
 */
export const approveDai = address => new Promise(async (resolve, reject) => {
  const contract = await DaiErc20Contract();

  const num = ethToWei(Number.MAX_SAFE_INTEGER.toString());

  try {
    await contract.methods.approve(tubInterfaceAddress, num).send({ from: address });

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Gets maker allowance for the users address from the dai erc20 contract
 *
 * @param address {String}
 * @return {Promise<Number>}
 */
export const getMakerAllowance = address => new Promise(async (resolve, reject) => {
  const contract = await MakerErc20Contract();

  try {
    const data = await contract.methods.allowance(address, tubInterfaceAddress).call();

    resolve(parseFloat(weiToEth(data)));
  } catch (err) {
    reject(err);
  }
});

/**
 * Gets dai balance for the users address from the dai erc20 contract
 *
 * @param address {String}
 * @return {Promise<Number>}
 */
export const getMakerBalance = address => new Promise(async (resolve, reject) => {
  const contract = await MakerErc20Contract();

  try {
    const data = await contract.methods.balanceOf(address).call();

    resolve(parseFloat(weiToEth(data)));
  } catch (err) {
    reject(err);
  }
});

/**
 * Approves that maker can be used for the users address on the dai erc20 contract
 *
 * @param address {String}
 * @return {Promise<Boolean>}
 */
export const approveMaker = address => new Promise(async (resolve, reject) => {
  const contract = await MakerErc20Contract();

  const num = ethToWei(Number.MAX_SAFE_INTEGER.toString());

  try {
    await contract.methods.approve(tubInterfaceAddress, num).send({ from: address });

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Transfers the cdp from one address to another address
 *
 * @param fromAddress {String}
 * @param toAddress {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 *
 * @return {Promise<Boolean>}
 */
export const transferCdp = (fromAddress, toAddress, cdpId, proxyAddress) => new Promise(async (resolve, reject) => {
  try {
    const contract = config.SaiSaverProxy;
    const contractFunction = contract.abi.find(abi => abi.name === 'give');

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const params = [saiTubAddress, cdpIdBytes32, toAddress];
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, params);

    await proxyContract.methods['execute(address,bytes)'](saiSaverProxyAddress, data).send({ from: fromAddress });

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls our marketplace contract and gets cdps that are up for sale
 *
 * @return {Promise<Array>}
 */
export const getItemsOnSale = () => new Promise(async (resolve, reject) => {
  try {
    const contract = await marketplaceContract();

    const cdpIds = await contract.methods.getItemsOnSale().call();
    const promises = cdpIds.map(id => contract.methods.items(id).call());

    const onPromiseEnd = (res) => {
      resolve(cdpIds.map((id, index) => ({
        id: window._web3.utils.hexToNumber(id),
        discount: parseFloat(res[index].discount) / 100,
      })));
    };

    Promise.all(promises).then(onPromiseEnd);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls our marketplace contract and lists it as on sale there
 *
 * @param sendTxFunc {Function}
 * @param account {String}
 * @param cdpId {Number}
 * @param discount {Number}
 * @param proxyAddress {String}
 *
 * @return {Promise<Boolean>}
 */
export const sellCdp = (sendTxFunc, account, cdpId, discount, proxyAddress) => new Promise(async (resolve, reject) => {
  try {
    let contractFunctionName = 'createAuthorizeAndSell';
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const contract = config.MarketplaceProxy;
    const DSProxyContract = await new window._web3.eth.Contract(config.DSProxy.abi, proxyAddress);

    const authorityAddress = await DSProxyContract.methods.authority().call();
    let params = [cdpIdBytes32, discount * 100, marketplaceAddress, proxyAddress];

    if (!isEmptyBytes(authorityAddress)) {
      const AuthContract = await new window._web3.eth.Contract(config.DSGuard.abi, authorityAddress);

      const isAuthorized = await AuthContract.methods.canCall(marketplaceAddress, proxyAddress, '0x1cff79cd').call();

      console.log(isAuthorized);

      if (isAuthorized) {
        contractFunctionName = 'sell';
        params = [cdpIdBytes32, discount * 100, marketplaceAddress];
      }
    }

    const contractFunction = contract.abi.find(abi => abi.name === contractFunctionName);
    const txParams = { from: account };
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, params);

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const promise = proxyContract.methods['execute(address,bytes)'](marketplaceProxyAddress, data).send(txParams);
    await sendTxFunc(promise);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls our marketplace contract and cancels the listing of our cdp on it
 *
 * @param sendTxFunc {Function}
 * @param account {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 *
 * @return {Promise<Boolean>}
 */
export const cancelSellCdp = (sendTxFunc, account, cdpId, proxyAddress) => new Promise(async (resolve, reject) => {
  try {
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const contract = config.MarketplaceProxy;
    const contractFunction = contract.abi.find(abi => abi.name === 'cancel');

    const params = [cdpIdBytes32, marketplaceAddress];
    const txParams = { from: account };
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, params);

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const promise = proxyContract.methods['execute(address,bytes)'](marketplaceProxyAddress, data).send(txParams);
    await sendTxFunc(promise);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls our marketplace contract and buys a cdp
 *
 * @param sendTxFunc {Function}
 * @param account {String}
 * @param cdpId {Number}
 *
 * @return {Promise<Boolean>}
 */
export const buyCdp = (sendTxFunc, cdpId, account) => new Promise(async (resolve, reject) => {
  const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

  try {
    const contract = await marketplaceContract();
    const cdpValue = await contract.methods.getCdpPrice(cdpIdBytes32).call();

    console.log(cdpValue[0].toString());

    const txParams = { from: account, value: '82118093668024885' };

    console.log(`Id: ${cdpId.toString()}, IdBytes: ${cdpIdBytes32}, ${txParams.from}, ${txParams.value}`);

    const promise = contract.methods.buy(cdpIdBytes32).send(txParams);
    await sendTxFunc(promise);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Creates a DSProxy contract for a user that does not have one
 *
 * @param sendTxFunc {Function}
 * @param account {String}
 * @return {Promise<{String}>}
 */
export const createDSProxy = (sendTxFunc, account) => new Promise(async (resolve, reject) => {
  try {
    const contract = await proxyRegistryInterfaceContract();

    const promise = contract.methods.build(account).send({ from: account });
    await sendTxFunc(promise);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Transfers the cdp from the user to the proxyAddress
 *
 * @param sendTxFunc {Function}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
 * @return {Promise<any>}
 */
export const migrateCdp = (sendTxFunc, cdpId, proxyAddress, account) => new Promise(async (resolve, reject) => {
  const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

  try {
    const contract = await TubInterfaceContract();

    const promise = contract.methods.give(cdpIdBytes32, proxyAddress).send({ from: account });
    await sendTxFunc(promise);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Fetches rate for exchanging eth with dai
 *
 * @param ethAmount {String}
 *
 * @return {Promise<Number>}
 */
export const getEthDaiKyberExchangeRate = ethAmount => new Promise(async (resolve, reject) => {
  const wei = ethToWei(ethAmount);

  try {
    const params = [ethTokenAddress, daiTokenAddress, wei];
    const contract = await KyberNetworkProxyContract();

    const res = await contract.methods.getExpectedRate(...params).call();

    resolve(parseFloat(weiToEth(res.expectedRate)));
  } catch (err) {
    reject(err);
  }
});

/**
 * Fetches rate for exchanging dai with eth
 *
 * @param daiAmount {String}
 *
 * @return {Promise<Number>}
 */
export const getDaiEthKyberExchangeRate = daiAmount => new Promise(async (resolve, reject) => {
  const wei = ethToWei(daiAmount);

  try {
    const params = [daiTokenAddress, ethTokenAddress, wei];
    const contract = await KyberNetworkProxyContract();

    const res = await contract.methods.getExpectedRate(...params).call();

    resolve(parseFloat(weiToEth(res.expectedRate)));
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls the proxy contract and handles the action that is specified in the parameters
 *
 * @param sendTxFunc {Function}
 * @param amount {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
 * @param funcName {String}
 * @param ethPrice {Number}
 * @param sendTrue {Boolean}
 *
 * @return {Promise<Object>}
 */
export const callSaverProxyContract = (
  sendTxFunc, amount, cdpId, proxyAddress, account, funcName, ethPrice, sendTrue = false,
) => new Promise(async (resolve, reject) => {
  const web3 = window._web3;

  try {
    const contract = config.SaverProxy;
    const contractFunction = contract.abi.find(abi => abi.name === funcName);

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const amountParam = web3.utils.toWei(amount, 'ether');
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const params = [cdpIdBytes32, amountParam];
    const txParams = { from: account };

    if (funcName !== 'boost') params.push(sendTrue);

    console.log('params', params);

    const data = web3.eth.abi.encodeFunctionCall(contractFunction, params);

    const promise = proxyContract.methods['execute(address,bytes)'](saverProxyAddress, data).send(txParams);
    await sendTxFunc(promise, amount);

    const newCdp = await getCdpInfo(cdpId, false);
    const newCdpInfo = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);

    resolve({ ...newCdp, ...newCdpInfo });
  } catch (err) {
    reject(err.message);
  }
});

/**
 * Gets the max eth that the user is able to send in the repay action
 *
 * @param cdpId {Number}
 *
 * @return {Promise<void>}
 */
export const getMaxEthRepay = async (cdpId) => {
  try {
    const contract = await SaverProxyContract();
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const data = await contract.methods.maxFreeCollateral(tubInterfaceAddress, cdpIdBytes32).call();

    console.log(data.toString());
    console.log(parseFloat(weiToEth(data)));

    return parseFloat(weiToEth(data));
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Gets the max dai that the user is able to send in the boost action
 *
 * @param cdpId {Number}
 *
 * @return {Promise<void>}
 */
export const getMaxDaiBoost = async (cdpId) => {
  try {
    const contract = await SaverProxyContract();
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const data = await contract.methods.maxFreeDai(tubInterfaceAddress, cdpIdBytes32).call();

    return parseFloat(weiToEth(data));
  } catch (err) {
    throw new Error(err);
  }
};

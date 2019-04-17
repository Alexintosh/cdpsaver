/* eslint-disable max-len */
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
  SaverProxyContract,
} from './contractRegistryService';
import config from '../config/config.json';
import { isEmptyBytes, numStringToBytes32 } from '../utils/utils';
import dsProxyContractJson from '../contracts/DSProxy.json';
import { getCdpInfo, getUpdatedCdpInfo } from './cdpService';
import callTx from './txService';

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

export const weiToEth = weiVal => window._web3.utils.fromWei(window._web3.utils.toBN(`${weiVal}`));

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
 * Helper function to verify if the contract has a permit method
 *
 * @param authorityAddress {String}
 *
 * @return {Promise<boolean>}
 */
async function isContractDSGuard(authorityAddress) {
  const code = await window._web3.eth.getCode(authorityAddress);

  const hash = window._web3.eth.abi.encodeFunctionSignature('permit(bytes32,bytes32,bytes32)');

  return code.indexOf(hash.substring(2)) !== -1;
}

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

/**
 * If MetaMask privacy is on, opens MetaMask modal to whitelist it
 *
 * @return {Promise<*>}
 */
export const metamaskApprove = async () => {
  try {
    if (window.ethereum) return window.ethereum.enable();
  } catch (e) {
    throw new Error((e));
  }
};

/**
 * Creates a cdp and a proxy address for the sender
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param from {String}
 * @param ethAmount {String}
 * @param _daiAmount {String}
 *
 * @return {Promise<any>}
 */
export const createCdpAndProxy = (
  accountType, path, sendTxFunc, from, ethAmount, _daiAmount,
) => new Promise(async (resolve, reject) => {
  try {
    const contract = await SaiSaverProxyContract();
    const params = { from, value: window._web3.utils.toWei(ethAmount, 'ether') };
    const daiAmount = window._web3.utils.toWei(_daiAmount.toString(), 'ether');

    const funcParams = [proxyRegistryInterfaceAddress, tubInterfaceAddress, daiAmount];

    await callTx(accountType, path, sendTxFunc, contract, 'createOpenLockAndDraw', funcParams, params);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Creates a cdp for a already created proxy address
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param from {String}
 * @param ethAmount {String}
 * @param _daiAmount {String}
 * @param proxyAddress {String}
 *
 * @return {Promise<any>}
 */
export const createCdp = (
  accountType, path, sendTxFunc, from, ethAmount, _daiAmount, proxyAddress,
) => new Promise(async (resolve, reject) => {
  try {
    const contract = config.SaiSaverProxy;

    const txParams = { from, value: window._web3.utils.toWei(ethAmount.toString(), 'ether') };
    const daiAmount = window._web3.utils.toWei(_daiAmount.toString(), 'ether');

    const proxyContract = new window._web3.eth.Contract(dsProxyContractJson.abi, proxyAddress);

    const contractFunction = contract.abi.reverse().find(abi => abi.name === 'lockAndDraw');

    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, [tubInterfaceAddress, daiAmount]);

    const funcParams = [saiSaverProxyAddress, data];

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls the payback action on the smart contract but passes other parameters than the callProxyContract
 * method
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param from {String}
 * @param _daiAmount {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param ethPrice {Number}
 *
 * @return {Promise<any>}
 */
export const paybackWithConversion = (
  accountType, path, sendTxFunc, from, _daiAmount, cdpId, proxyAddress, ethPrice,
) => new Promise(async (resolve, reject) => {
  try {
    const contract = config.SaiSaverProxy;

    const OTC_ADDRESS = '0x4A6bC4e803c62081ffEbCc8d227B5a87a58f1F8F';

    const txParams = { from };
    const daiAmount = window._web3.utils.toWei(_daiAmount.toString(), 'ether');

    const proxyContract = new window._web3.eth.Contract(dsProxyContractJson.abi, proxyAddress);

    const contractFunction = contract.abi.find(abi => abi.name === 'wipe');

    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const dataParams = [tubInterfaceAddress, cdpIdBytes32, daiAmount, OTC_ADDRESS];
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, dataParams);
    const funcParams = [saiSaverProxyAddress, data];

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

    const newCdp = await getCdpInfo(cdpId, false);
    const newCdpInfo = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);

    resolve({ ...newCdp, ...newCdpInfo });
  } catch (err) {
    reject(err);
  }
});


export const closeWithConversion = (
  accountType, path, sendTxFunc, from, cdpId, proxyAddress, ethPrice,
) => new Promise(async (resolve, reject) => {
  try {
    const contract = config.SaiSaverProxy;

    const OTC_ADDRESS = '0x4A6bC4e803c62081ffEbCc8d227B5a87a58f1F8F';

    const txParams = { from };

    const proxyContract = new window._web3.eth.Contract(dsProxyContractJson.abi, proxyAddress);

    // shut(address tub_, bytes32 cup, address otc_)
    const contractFunction = contract.abi.find(abi => abi.name === 'shut');

    console.log(contractFunction);

    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const dataParams = [tubInterfaceAddress, cdpIdBytes32, OTC_ADDRESS];
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, dataParams);
    const funcParams = [saiSaverProxyAddress, data];

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

    const newCdp = await getCdpInfo(cdpId, false);
    const newCdpInfo = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);

    resolve({ ...newCdp, ...newCdpInfo });
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls the proxy contract and handles the action that is specified in the parameters
 *
 * @param accountType {String}
 * @param path {String}
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
  accountType, path, sendTxFunc,
  amount, cdpId, proxyAddress, account, funcName, ethPrice, sendAsValue = false, sendEmptyAddress = false,
) => new Promise(async (resolve, reject) => {
  const web3 = window._web3;

  try {
    const contract = config.SaiSaverProxy;
    const contractFunction = contract.abi.find(abi => abi.name === funcName);

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const amountParam = web3.utils.toWei(amount.toString());
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
    const funcParams = [saiSaverProxyAddress, data];

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

    const newCdp = await getCdpInfo(cdpId, false);
    const newCdpInfo = await getUpdatedCdpInfo(newCdp.depositedETH.toNumber(), newCdp.debtDai.toNumber(), ethPrice);

    resolve({ ...newCdp, ...newCdpInfo });
  } catch (err) {
    console.log(err);
    reject(err.message);
  }
});

/**
 * Gets dai allowance for the users address from the dai erc20 contract
 *
 * @param address {String}
 * @param proxyAddress {String}
 *
 * @return {Promise<Number>}
 */
export const getDaiAllowance = (address, proxyAddress) => new Promise(async (resolve, reject) => {
  const contract = await DaiErc20Contract();

  try {
    const data = await contract.methods.allowance(address, proxyAddress).call();

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
 * @param accountType {String}
 * @param path {String}
 * @param address {String}
 * @param proxyAddress {String}
 * @param sendTxFunc {Function}
 *
 * @return {Promise<Boolean>}
 */
export const approveDai = (
  accountType, path, address, proxyAddress, sendTxFunc,
) => new Promise(async (resolve, reject) => {
  const contract = await DaiErc20Contract();

  const num = ethToWei(Number.MAX_SAFE_INTEGER.toString());

  try {
    await callTx(accountType, path, sendTxFunc, contract, 'approve', [proxyAddress, num], { from: address });

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Gets maker allowance for the users address from the dai erc20 contract
 *
 * @param address {String}
 * @param proxyAddress {String}
 *
 * @return {Promise<Number>}
 */
export const getMakerAllowance = (address, proxyAddress) => new Promise(async (resolve, reject) => {
  const contract = await MakerErc20Contract();

  try {
    const data = await contract.methods.allowance(address, proxyAddress).call();

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
 * @param accountType {String}
 * @param path {String}
 * @param address {String}
 * @param proxyAddress {String}
 * @param sendTxFunc {Function}
 *
 * @return {Promise<Boolean>}
 */
export const approveMaker = (
  accountType, path, address, proxyAddress, sendTxFunc,
) => new Promise(async (resolve, reject) => {
  const contract = await MakerErc20Contract();

  const num = ethToWei(Number.MAX_SAFE_INTEGER.toString());

  try {
    await callTx(accountType, path, sendTxFunc, contract, 'approve', [proxyAddress, num], { from: address });

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Transfers the cdp from one address to another address
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param fromAddress {String}
 * @param toAddress {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 *
 * @return {Promise<Boolean>}
 */
export const transferCdp = (
  accountType, path, sendTxFunc, fromAddress, toAddress, cdpId, proxyAddress,
) => new Promise(async (resolve, reject) => {
  try {
    const contract = config.SaiSaverProxy;
    const contractFunction = contract.abi.find(abi => abi.name === 'give');

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);

    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const params = [saiTubAddress, cdpIdBytes32, toAddress];
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, params);
    const funcParams = [saiSaverProxyAddress, data];
    const txParams = { from: fromAddress };

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

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
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param account {String}
 * @param cdpId {Number}
 * @param discount {Number}
 * @param proxyAddress {String}
 *
 * @return {Promise<Boolean>}
 */
export const sellCdp = (
  accountType, path, sendTxFunc, account, cdpId, discount, proxyAddress,
) => new Promise(async (resolve, reject) => {
  try {
    let contractFunctionName = 'createAuthorizeAndSell';
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const contract = config.MarketplaceProxy;
    const DSProxyContract = await new window._web3.eth.Contract(config.DSProxy.abi, proxyAddress);

    const authorityAddress = await DSProxyContract.methods.authority().call();
    let params = [cdpIdBytes32, discount * 100, marketplaceAddress, proxyAddress];

    const isContract = await isContractDSGuard(authorityAddress);

    if (!isEmptyBytes(authorityAddress) && isContract) {
      const AuthContract = await new window._web3.eth.Contract(config.DSGuard.abi, authorityAddress);

      const isAuthorized = await AuthContract.methods.canCall(marketplaceAddress, proxyAddress, '0x1cff79cd').call();

      if (isAuthorized) {
        contractFunctionName = 'sell';
        params = [cdpIdBytes32, discount * 100, marketplaceAddress];
      } else {
        contractFunctionName = 'authorizeAndSell';
      }
    }

    const contractFunction = contract.abi.find(abi => abi.name === contractFunctionName);
    const txParams = { from: account };
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, params);

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);
    const funcParams = [marketplaceProxyAddress, data];

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls our marketplace contract and cancels the listing of our cdp on it
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param account {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 *
 * @return {Promise<Boolean>}
 */
export const cancelSellCdp = (
  accountType, path, sendTxFunc, account, cdpId, proxyAddress,
) => new Promise(async (resolve, reject) => {
  try {
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const contract = config.MarketplaceProxy;
    const contractFunction = contract.abi.find(abi => abi.name === 'cancel');

    const params = [cdpIdBytes32, marketplaceAddress];
    const txParams = { from: account };
    const data = window._web3.eth.abi.encodeFunctionCall(contractFunction, params);

    const dsProxyContractAbi = dsProxyContractJson.abi;
    const proxyContract = new window._web3.eth.Contract(dsProxyContractAbi, proxyAddress);
    const funcParams = [marketplaceProxyAddress, data];

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calls our marketplace contract and buys a cdp
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param account {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 *
 * @return {Promise<Boolean>}
 */
export const buyCdp = (
  accountType, path, sendTxFunc, cdpId, account, proxyAddress,
) => new Promise(async (resolve, reject) => {
  const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

  try {
    const contract = await marketplaceContract();
    const cdpValue = await contract.methods.getCdpPrice(cdpIdBytes32).call();

    const txParams = { from: account, value: cdpValue[0].toString() };

    const newOwner = proxyAddress || account;

    await callTx(accountType, path, sendTxFunc, contract, 'buy', [cdpIdBytes32, newOwner], txParams);

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Creates a DSProxy contract for a user that does not have one
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param account {String}
 * @return {Promise<{String}>}
 */
export const createDSProxy = (accountType, path, sendTxFunc, account) => new Promise(async (resolve, reject) => {
  try {
    const contract = await proxyRegistryInterfaceContract();

    await callTx(accountType, path, sendTxFunc, contract, 'build', [account], { from: account });

    resolve(true);
  } catch (err) {
    reject(err);
  }
});

/**
 * Transfers the cdp from the user to the proxyAddress
 *
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
 * @return {Promise<any>}
 */
export const migrateCdp = (
  accountType, path, sendTxFunc, cdpId, proxyAddress, account,
) => new Promise(async (resolve, reject) => {
  const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

  try {
    const contract = await TubInterfaceContract();

    await callTx(accountType, path, sendTxFunc, contract, 'give', [cdpIdBytes32, proxyAddress], { from: account });

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
 * @param accountType {String}
 * @param path {String}
 * @param sendTxFunc {Function}
 * @param amount {String}
 * @param cdpId {Number}
 * @param proxyAddress {String}
 * @param account {String}
 * @param funcName {String}
 * @param ethPrice {Number}
 * @param buyMkr {Boolean}
 *
 * @return {Promise<Object>}
 */
export const callSaverProxyContract = (
  accountType, path, sendTxFunc, amount, cdpId, proxyAddress, account, funcName, ethPrice, buyMkr = false,
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

    if (funcName === 'repay') {
      params.push(buyMkr);
      params.push(account);
    }

    console.log(params);

    const data = web3.eth.abi.encodeFunctionCall(contractFunction, params);
    const funcParams = [saverProxyAddress, data];

    await callTx(accountType, path, sendTxFunc, proxyContract, 'execute(address,bytes)', funcParams, txParams);

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
export const getMaxEthRepay = async (cdpId, collateral) => {
  try {
    const contract = await SaverProxyContract();
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const data = await contract.methods.maxFreeCollateral(tubInterfaceAddress, cdpIdBytes32).call();

    let maxRepay = parseFloat(weiToEth(data));

    if ((collateral - maxRepay) <= 0.005) {
      maxRepay = collateral - 0.005001;
    }

    return maxRepay;
  } catch (err) {
    console.log(err);
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

    const maxDai = parseFloat(weiToEth(data));

    return maxDai;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Calculates if you have enough mkr to pay the calculated fee
 *
 * @param account {String}
 * @param cdpId {Number}
 * @param _amount {String}
 *
 * @return {Promise<Boolean>}
 */
export const getEnoughMkrToWipe = (account, cdpId, _amount) => new Promise(async (resolve, reject) => {
  try {
    const contract = await SaverProxyContract();

    const mkrBalance = await getMakerBalance(account);
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const amount = ethToWei(_amount);

    const feeInMkr = await contract.methods.stabilityFeeInMkr(tubInterfaceAddress, cdpIdBytes32, amount).call();

    resolve(mkrBalance >= parseFloat(weiToEth(feeInMkr.toString())));
  } catch (err) {
    reject(err);
  }
});

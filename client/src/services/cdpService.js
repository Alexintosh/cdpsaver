import Maker from '@makerdao/dai';
import web3 from 'web3';
import config from '../config/config.json';
import clientConfig from '../config/clientConfig.json';
import { proxyRegistryInterfaceContract, SaiTubAddressContract } from './contractRegistryService';
import { saiTubContractTools } from '../utils/utils';

export const maker = Maker.create('http', { url: clientConfig.provider });

/**
 * Fetches multiple Cdp data for a cdp id from the Maker library  and formats them
 * @param id {Number}
 * @param useAuth {Boolean}
 *
 * @return {Promise<{id: number, owner: string, depositedPETH: *, depositedETH: string, depositedUSD: string, generatedDAI: number, liquidationPrice: string, isSafe: bool, ratio: *}>}
 */
export const getCdpInfo = (id, useAuth = true) => new Promise(async (resolve, reject) => {
  try {
    if (useAuth) await maker.authenticate();

    const cdp = await maker.getCdp(id);
    const info = await cdp.getInfo();

    resolve({
      id,
      owner: info[0],
      depositedPETH: parseFloat(web3.utils.fromWei(info[1].toString(), 'ether')),
      generatedDAI: parseFloat(web3.utils.fromWei(info[2].toString(), 'ether')),
      debtDai: (await cdp.getDebtValue())._amount,
      depositedETH: (await cdp.getCollateralValue())._amount,
      depositedUSD: (await cdp.getCollateralValue(Maker.USD))._amount,
      liquidationPrice: (await cdp.getLiquidationPrice())._amount,
      isSafe: await cdp.isSafe(),
      ratio: await cdp.getCollateralizationRatio(), // cdp.getCollateralizationRatio() returns the USD value of the collateral in the CDP divided by the USD value of the Dai debt for the CDP, e.g. 2.5.
    });
  } catch (err) {
    reject(err);
  }
});

/**
 * Gets Cdp info for an array of ids and returns a Promise
 * @param ids {Array}
 *
 * @return {Promise<any>}
 */
export const getCdpInfos = ids => new Promise(async (resolve, reject) => {
  try {
    await maker.authenticate();

    const res = await Promise.all(ids.map(id => getCdpInfo(id, false)));
    resolve(res);
  } catch (err) {
    reject(err);
  }
});

/**
 * * Creates a CDP on the blockchain with ethAmount and daiAmountInfo
 *
 * @param ethAmount
 * @param daiAmount
 *
 * @return {Promise<{id: number, owner: string, depositedPETH: *, depositedETH: string, depositedUSD: string, generatedDAI: number, liquidationPrice: string, isSafe: bool, ratio: *}>}
 */
export const createCdp = async (ethAmount, daiAmount) => {
  try {
    // create logic here
    return await getCdpInfo(3613);
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Calls the SaiTub contract and fetches cdp for proxy address from alternative event
 *
 * @param contract {Object}
 * @param proxyAddress {String}
 *
 * @return {Promise<Number>}
 */
export const getCdpIdFromLogNote = (contract, proxyAddress) => new Promise(async (resolve, reject) => {
  const sig = Object(saiTubContractTools.formatMethodName)('give(bytes32,address)');
  const bar = Object(saiTubContractTools.formatProxyAddress)(proxyAddress);

  try {
    contract.getPastEvents('LogNote', {
      filter: { sig, bar },
      fromBlock: config.SaiTub.networks[clientConfig.network].createdBlock,
    }, (err, res) => {
      if (err) return reject(err);

      if (res.length === 0) return resolve(null);

      resolve(web3.utils.hexToNumber(res[0].returnValues.foo));
    });
  } catch (e) {
    reject(e);
  }
});

/**
 * Calls the SaiTub contract and fetches cdp for proxy address from the LogNewCup event
 *
 * @param contract {Object}
 * @param address {String}
 *
 * @return {Promise<Number>}
 */
export const getCdpIdFromLogNewCup = (contract, address) => new Promise(async (resolve, reject) => {
  try {
    contract.getPastEvents('LogNewCup', {
      filter: { lad: address },
      fromBlock: config.SaiTub.networks[clientConfig.network].createdBlock,
    }, (err, res) => {
      if (err) return reject(err);

      if (res.length === 0) return resolve(null);

      resolve(web3.utils.hexToNumber(res[0].returnValues.cup));
    });
  } catch (e) {
    reject(e);
  }
});

/**
 * Checks if the connected user has a cdp for their address
 *
 */
export const getAddressCdp = address => new Promise(async (resolve, reject) => {
  if (!address) return reject('user has no address');

  try {
    const proxyAddr = await proxyRegistryInterfaceContract().methods.proxies(address).call();

    if (!proxyAddr) return resolve(null);

    const contract = await SaiTubAddressContract();
    let cdpId = await getCdpIdFromLogNewCup(contract, proxyAddr);

    // If the cdpId is not found in the LogNewCup event,
    // try searching in the LogNoteEvent
    if (!cdpId) cdpId = await getCdpIdFromLogNote(contract, proxyAddr);

    const cdp = await getCdpInfo(cdpId, true);
    resolve(cdp);
  } catch (err) {
    reject(err);
  }
});

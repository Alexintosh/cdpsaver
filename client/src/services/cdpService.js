import Maker from '@makerdao/dai';
import web3 from 'web3';
import clientConfig from '../config/clientConfig.json';
import { proxyRegistryInterfaceContract } from './contractRegistryService';

const maker = Maker.create('http', { url: clientConfig.providerUrl });

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
      debtDai: await cdp.getDebtValue(),
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
 * Checks if the connected user has a cdp for their address
 *
 */
export const getAddressCdp = address => new Promise(async (resolve, reject) => {
  if (!address) return reject('user has no address');

  try {
    const result = await proxyRegistryInterfaceContract().methods.proxies(address).call();

    resolve(result);
  } catch (err) {
    reject(err);
  }
});

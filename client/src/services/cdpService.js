import Maker from '@makerdao/dai';
import web3 from 'web3';
import clientConfig from '../config/clientConfig.json';
import { proxyRegistryInterfaceContract, SaiTubAddressContract } from './contractRegistryService';
import { MOCK_CDP } from '../constants/general';

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
 * Calls the SaiTub contract and fetches cdp for proxy address
 *
 * @param sig
 * @param bar
 *
 * @return {Promise<any>}
 */
export const getCdpForAddress = (sig, bar) => new Promise(async (resolve, reject) => {
  try {
    const contract = await SaiTubAddressContract();

    const event = await contract.getPastEvents('LogNote', {
      filter: { bar, sig },
      fromBlock: 5216602,
    });

    console.log('event', event);
  } catch (e) {
    console.log('ERR', e);
    reject(e);
  }
});

const x = {
  u: (e, t, n) => new Array(t - e.length + 1).join(n || "0") + e, // eslint-disable-line
  m: e => web3.utils.sha3(e).substring(0, 10),
  q: (e) => {
    const t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]; // eslint-disable-line
    let n = web3.utils.toHex(e);

    return n = n.replace('0x', ''), // eslint-disable-line
    n = x.u(n, 64), // eslint-disable-line
    t && (n = '0x' + n), // eslint-disable-line
    n; // eslint-disable-line
  },
};

/**
 * Checks if the connected user has a cdp for their address
 *
 */
export const getAddressCdp = address => new Promise(async (resolve, reject) => {
  if (!address) return reject('user has no address');

  const sig = Object(x.m)('give(bytes32,address)');
  const bar = Object(x.q)(address);
  try {
    // const proxyAddress = await proxyRegistryInterfaceContract().methods.proxies(address).call();
    // console.log('proxyAddress', proxyAddress);
    // const checksumAddress = web3.utils.toChecksumAddress(proxyAddress);

    const cdpMeta = await getCdpForAddress(sig, bar);
    console.log('cdpMeta', cdpMeta);
    return;
    const cdp = await getCdpInfo(cdpMeta.id, true);

    resolve(MOCK_CDP);
  } catch (err) {
    console.log('ERROR', err);
    reject(err);
  }
});

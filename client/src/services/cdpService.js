import Maker from '@makerdao/dai';
import config from '../config/config.json';
import clientConfig from '../config/clientConfig.json';
import { marketplaceContract, proxyRegistryInterfaceContract, SaiTubContract } from './contractRegistryService';
import { isEmptyBytes, numStringToBytes32, saiTubContractTools } from '../utils/utils';
import { getEthPrice } from './priceService';

export const maker = Maker.create('http', { url: clientConfig.provider });

/**
 * Calls the marketplace contract that checks if the cdp is for sale
 *
 * @param cdpId
 *
 * @return {Promise<Boolean>}
 */
const isCdpOnSale = cdpId => new Promise(async (resolve, reject) => {
  try {
    const contract = await marketplaceContract();
    const cdpIdBytes32 = numStringToBytes32(cdpId.toString());

    const onSale = await contract.methods.isOnSale(cdpIdBytes32).call();
    resolve(onSale);
  } catch (err) {
    reject(err);
  }
});

/**
 * Helper function to go through the cdp list and find all the CDPs the address owns
 *
 * @param contract {Object}
 * @param arr {String}
 * @param address {Object}
 * @param type {String}
 *
 * @return {Number} cdpId
 */
const findCDPs = async (contract, arr, address, type) => {
  const cdpIds = arr.map(event => event.returnValues[type]);

  const promises = cdpIds.map(id => new Promise(async (resolve, reject) => {
    try {
      const info = await contract.methods.cups(id).call();

      resolve(info.lad === address ? window._web3.utils.hexToNumber(id) : null);
    } catch (err) {
      reject(err);
    }
  }));

  return (await Promise.all(promises)).filter(id => id !== null);
};

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
      depositedPETH: parseFloat(window._web3.utils.fromWei(info[1].toString(), 'ether')),
      generatedDAI: parseFloat(window._web3.utils.fromWei(info[2].toString(), 'ether')),
      debtDai: (await cdp.getDebtValue())._amount,
      debtUsd: (await cdp.getDebtValue(Maker.USD))._amount,
      depositedETH: (await cdp.getCollateralValue())._amount,
      depositedUSD: (await cdp.getCollateralValue(Maker.USD))._amount,
      liquidationPrice: (await cdp.getLiquidationPrice())._amount,
      isSafe: await cdp.isSafe(),
      ratio: await cdp.getCollateralizationRatio(), // cdp.getCollateralizationRatio() returns the USD value of the collateral in the CDP divided by the USD value of the Dai debt for the CDP, e.g. 2.5.
      cdpInstance: cdp,
      onSale: await isCdpOnSale(id),
      governanceFee: (await cdp.getGovernanceFee())._amount,
      governanceFeeInUsd: (await cdp.getGovernanceFee(Maker.USD))._amount,
    });
  } catch (err) {
    reject(err);
  }
});

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
    }, async (err, res) => {
      if (err) return reject(err);

      if (res.length === 0) return resolve([]);

      const cdpIds = await findCDPs(contract, res, proxyAddress, 'foo');

      console.log('Log note: ', cdpIds.length);

      resolve(cdpIds);
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
    }, async (err, res) => {
      if (err) return reject(err);

      if (res.length === 0) return resolve([]);

      const cdpIds = await findCDPs(contract, res, address, 'cup');

      console.log('New cup: ', cdpIds.length);

      resolve(cdpIds);
    });
  } catch (e) {
    reject(e);
  }
});

/**
 * Checks if the connected user has a cdp for their account or proxyAddress
 *
 * @param address {String}
 *
 * @return {Promise<Object>}
 */
export const getAddressCdp = address => new Promise(async (resolve, reject) => {
  if (!address) return reject('user has no address');

  try {
    const proxyAddress = await proxyRegistryInterfaceContract().methods.proxies(address).call();

    const contract = await SaiTubContract();

    const logCupAddressCdpIds = await getCdpIdFromLogNewCup(contract, address);
    const logNoteAddressCdpIds = await getCdpIdFromLogNote(contract, address);

    const logCupProxyAddressCdpIds = await getCdpIdFromLogNewCup(contract, proxyAddress);
    const logNoteProxyAddressCdpIds = await getCdpIdFromLogNote(contract, proxyAddress);

    const cdpIds = [...new Set([...logCupAddressCdpIds, ...logNoteAddressCdpIds, ...logCupProxyAddressCdpIds, ...logNoteProxyAddressCdpIds])]; // eslint-disable-line

    const promises = cdpIds.map(id => getCdpInfo(id, true));

    const cdps = await Promise.all(promises);

    // TODO switch this with the selected cdp from local storage
    const cdp = cdps[0] || null;

    resolve({ proxyAddress: isEmptyBytes(proxyAddress) ? '' : proxyAddress, cdp, cdps });
  } catch (err) {
    reject(err);
  }
});

/**
 * Gets the updated cdp information based on input change
 *
 *
 * @param ethAmount Collateral in the cdp in eth
 * @param daiAmount Amount of debt that is in the cdp
 * @param _ethPrice
 *
 * @return {liquidationPrice, ratio} Returns the liquidation price and ration based on the input params
 *
 */
export const getUpdatedCdpInfo = async (ethAmount, daiAmount, _ethPrice = false) => {
  try {
    const liqRatio = 1.5;
    const price = maker.service('price');

    let ethPrice = _ethPrice;
    if (!ethPrice) ethPrice = parseFloat(await getEthPrice());

    const peth2wethRatio = await price.getWethToPethRatio();

    const liquidationPrice = (parseFloat(daiAmount) * liqRatio) / (parseFloat(ethAmount) * peth2wethRatio);
    const ratio = ((parseFloat(ethAmount) * ethPrice * peth2wethRatio) / parseFloat(daiAmount)) * 100;

    return {
      liquidationPrice,
      ratio,
    };
  } catch (err) {
    throw new Error(err);
  }
};


/**
 * Gets Cdp info for an array of ids and returns a Promise
 * @param ids {Array}
 *
 * @return {Promise<Array>}
 */
export const getCdpInfos = ids => new Promise(async (resolve, reject) => {
  try {
    await maker.authenticate();

    const res = await Promise.all(ids.map(id => new Promise(async (resolve2, reject2) => {
      try {
        const cdp = await getCdpInfo(id, false);
        const newInfo = await getUpdatedCdpInfo(cdp.depositedETH.toNumber(), cdp.debtDai.toNumber());

        resolve2({ ...cdp, ...newInfo });
      } catch (err) {
        reject2(err);
      }
    })));

    resolve(res);
  } catch (err) {
    reject(err);
  }
});

/**
 * Calculates the max amount of dai that the user can withdraw from the cdp
 *
 * @param daiDebt
 * @param collateral
 * @param _ethPrice
 *
 * @return {Promise<number>}
 */
export const getMaxDai = async (daiDebt, collateral, _ethPrice) => {
  try {
    const price = maker.service('price');

    let ethPrice = _ethPrice;
    if (!ethPrice) ethPrice = parseFloat(await getEthPrice());

    const peth2wethRatio = await price.getWethToPethRatio();

    let maxDai = (((collateral * ethPrice) * peth2wethRatio) / (150 / 100)) - daiDebt;

    maxDai -= (maxDai / 100); // go over the 150% ratio a little bit

    return maxDai;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Calculates the max amount of eth that the user can withdraw from the cdp
 *
 * @param daiDebt
 * @param collateral
 * @param _ethPrice
 *
 * @return {Promise<number>}
 */
export const getMaxEthWithdraw = async (daiDebt, collateral, _ethPrice) => {
  try {
    const price = maker.service('price');

    let ethPrice = _ethPrice;
    if (!ethPrice) ethPrice = parseFloat(await getEthPrice());

    const peth2wethRatio = await price.getWethToPethRatio();

    let maxEth = collateral - (((150 / 100) * daiDebt) / (ethPrice * peth2wethRatio));

    maxEth -= (maxEth / 100); // go over the 150% ratio a little bit

    return maxEth;
  } catch (err) {
    throw new Error(err);
  }
};

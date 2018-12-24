import Maker from '@makerdao/dai';

const maker = Maker.create('browser');

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
      owner: info[0].toString(),
      depositedPETH: info[1].toString(),
      generatedDAI: info[2].toString(),
      depositedETH: (await cdp.getCollateralValue())._amount.toString(),
      depositedUSD: (await cdp.getCollateralValue(Maker.USD))._amount.toString(),
      liquidationPrice: (await cdp.getLiquidationPrice())._amount.toString(),
      isSafe: await cdp.isSafe(),
      ratio: await cdp.getCollateralizationRatio(),
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
 * TODO IMPLEMENT LATE
 *
 * @param ethAmount
 * @param daiAmount
 *
 * @return {Promise<{id: number, owner: string, depositedPETH: *, depositedETH: string, depositedUSD: string, generatedDAI: number, liquidationPrice: string, isSafe: bool, ratio: *}>}
 */
export const createCdp = async (ethAmount, daiAmount) => {
  try {
    // create logic here
    console.log('ETH', ethAmount, 'DAI', daiAmount);
    const cdpInfo = await getCdpInfo(3613);
    return cdpInfo;
  } catch (err) {
    throw new Error(err);
  }
};

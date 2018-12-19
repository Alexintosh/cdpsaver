import Maker from '@makerdao/dai';

const maker = Maker.create('browser');

export const getCdpInfo = async (id) => {
  await maker.authenticate();

  const cdp = await maker.getCdp(id);

  const info = await cdp.getInfo();
  const depositedETH = await cdp.getCollateralValue();
  const depositedUSD = await cdp.getCollateralValue(Maker.USD);
  const liquidationPrice = await cdp.getLiquidationPrice();
  const ratio = await cdp.getCollateralizationRatio();

  const isSafe = await cdp.isSafe();

  return {
    owner: info[0].toString(),
    depositedPETH: info[1].toString(),
    depositedETH: depositedETH._amount.toString(),
    depositedUSD: depositedUSD._amount.toString(),
    generatedDAI: info[2].toString(),
    liquidationPrice: liquidationPrice._amount.toString(),
    isSafe,
    ratio,
  };
};
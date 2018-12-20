
const PETH_ETH_RATIO = 1.040;
const LIQUIDATION_RATIO = 1.5;
const ETH_PRICE = 92.832;

function getLiquidationPrice(daiDebt, collateral) {
    return (daiDebt * LIQUIDATION_RATIO) / (collateral * PETH_ETH_RATIO);
}

function getRatio(daiDebt, collateral) {
    return (collateral * ETH_PRICE * PETH_ETH_RATIO) / daiDebt * 100;
}

function getMaxCollateral(daiDebt, collateral) {
    return collateral - (((150/100)*daiDebt) / (ETH_PRICE * PETH_ETH_RATIO));
}

function getMaxDai(daiDebt, collateral) {
    return (collateral* ETH_PRICE * PETH_ETH_RATIO / (150/100)) - daiDebt;
}

function payBack(daiDebt, collateral) {
    const max_col = getMaxCollateral(daiDebt, collateral);
    const converted_dai = max_col * (ETH_PRICE - (ETH_PRICE/100)*3);

    console.log(getLiquidationPrice(daiDebt - converted_dai, collateral - max_col), getMaxCollateral(daiDebt - converted_dai, collateral - max_col));
}

function cdpInfo(daiDebt, collateral) {
    console.log('getLiquidationPrice: ', getLiquidationPrice(daiDebt, collateral));
    console.log('getMaxCollateral: ', getMaxCollateral(daiDebt, collateral));
    console.log('getMaxDai: ', getMaxDai(daiDebt, collateral));
}

cdpInfo(20830, 333.78823);
payBack(20830, 333.78823);

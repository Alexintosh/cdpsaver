
const PETH_ETH_RATIO = 1.000156423227856149; //await price.getWethToPethRatio();
const LIQUIDATION_RATIO = 1.5;
const ETH_PRICE = 181.0275; // await price.getEthPrice();

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


function payBack(daiDebt, collateral, ratio) {
    const max_col = getMaxCollateral(daiDebt, collateral);
    const converted_dai = max_col * (ETH_PRICE - (ETH_PRICE/100)*3);

    cdpInfo(daiDebt - converted_dai, collateral - max_col);

    console.log("   ");

    if (getRatio(daiDebt - converted_dai, collateral - max_col) < ratio) {
        payBack(daiDebt - converted_dai, collateral - max_col, ratio);
    }
}

function cdpInfo(daiDebt, collateral) {
    console.log('Debt left: ' + daiDebt + "  Collateral: " + collateral);
    console.log('Ratio: ', getRatio(daiDebt, collateral));
    console.log('getLiquidationPrice: ', getLiquidationPrice(daiDebt, collateral));
    console.log('getMaxCollateral: ', getMaxCollateral(daiDebt, collateral));
    console.log('getMaxDai: ', getMaxDai(daiDebt, collateral));
}

cdpInfo(8.121941885507526, 0.12661483067650073);
// console.log("   ");
// payBack(6663, 102.52, 300);

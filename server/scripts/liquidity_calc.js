
const fs = require('fs');

const PETH_ETH_RATIO = 1.0403682783072323; //await price.getWethToPethRatio();
const LIQUIDATION_RATIO = 1.5;
const ETH_PRICE = 115.3125; // await price.getEthPrice();

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
    return (collateral* ETH_PRICE * PETH_ETH_RATIO / LIQUIDATION_RATIO) - daiDebt;
}


function payBack(daiDebt, collateral, ratio) {
    const max_col = getMaxCollateral(daiDebt, collateral);
    const converted_dai = max_col * (ETH_PRICE - (ETH_PRICE/100)*1);

    console.log("Converted dai: ", converted_dai);

    cdpInfo(daiDebt - converted_dai, collateral - max_col);

    console.log("   ");

    // if (getRatio(daiDebt - converted_dai, collateral - max_col) < ratio) {
    //     payBack(daiDebt - converted_dai, collateral - max_col, ratio);
    // }
}

function cdpInfo(daiDebt, collateral) {
    console.log('Debt left: ' + daiDebt + "  Collateral: " + collateral);
    console.log('Ratio: ', getRatio(daiDebt, collateral));
    console.log('getLiquidationPrice: ', getLiquidationPrice(daiDebt, collateral));
    console.log('getMaxCollateral: ', getMaxCollateral(daiDebt, collateral));
    console.log('getMaxDai: ', getMaxDai(daiDebt, collateral));
}

function payBackGetRatio(daiDebt, collateral, conversionLost) {
    const max_col = getMaxCollateral(daiDebt, collateral);
    const converted_dai = max_col * (ETH_PRICE - (ETH_PRICE/100)*conversionLost);

    // console.log("max col " + max_col + " Converted dai: ", converted_dai);

    return getRatio(daiDebt - converted_dai, collateral - max_col);
}

function getRatiosAfterRepay() {
    const collateral = 1; // 1 eth

    let data = [];

    for(let i = 1; i <= 100; ++i) {
        const daiDebt = (collateral* ETH_PRICE * PETH_ETH_RATIO / (LIQUIDATION_RATIO + (i / 100)));

        let ratios = [];
        //for(let j = 0; j < 1; ++j) {
            ratios[0] = payBackGetRatio(daiDebt, collateral, 10).toFixed(4);
        //}

        data.push({oldRatio: (LIQUIDATION_RATIO*100) + i, ratios})
    }

    const file = fs.createWriteStream('ratios.txt');
    data.forEach((v) => file.write(`${v.ratios[0]}\n`));
    file.end();
}

//console.log('getMaxDai: ', getMaxDai(0, 1));

getRatiosAfterRepay();

// cdpInfo(79.9, 1);
// console.log("   ");
// payBack(12219.496868344668, 159.71571463526143, 200);

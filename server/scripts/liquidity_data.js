const axios = require("axios");

axios.get("https://mkr.tools/api/v1/bites")
  .then((res) => {

    let sumOfPethLiquidated = 0;
    let sumOfDollarsLost = 0;

    res.data.forEach(bite => {
        sumOfPethLiquidated += bite.arg;
        let priceOfLiquidation = bite.pip;
        sumOfDollarsLost += priceOfLiquidation * (bite.arg * bite.per);
    });

    const penality = (sumOfPethLiquidated/100)*13;
    const penalityDollars = (sumOfDollarsLost/100)*13;

    console.log(`Number od Cdp liquidated: ${res.data.length}`);
    console.log(`Amount of Peth liquidated:  ${sumOfPethLiquidated.toFixed(2)} PETH`);
    console.log(`Amount lost due to penality fee:  ${penality.toFixed(2)} PETH\n`);
    console.log(`Amount of dollars liquidated: ${sumOfDollarsLost.toFixed(0)}$`);
    console.log(`Amount of dollars lost due to penality fee: ${penalityDollars.toFixed(0)}$\n`);

  })
  .catch((err) => {
    console.log(err);
  });
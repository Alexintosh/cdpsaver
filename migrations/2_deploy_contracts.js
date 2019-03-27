const SaverProxy = artifacts.require("./SaverProxy.sol");
const Monitor = artifacts.require("./Monitor.sol");
const KyberWrapper = artifacts.require("./KyberWrapper.sol");
const Marketplace = artifacts.require("./Marketplace.sol");
const MarketplaceProxy = artifacts.require("./MarketplaceProxy.sol");

require('dotenv').config();

module.exports = function(deployer, network) {
  let deployAgain = (process.env.DEPLOY_AGAIN === 'true') ? true : false;

  if (network == 'kovan') {
    deployer.deploy(SaverProxy, {gas: 6720000, overwrite: deployAgain});

    // deployer.deploy(Monitor, {gas: 6720000, overwrite: deployAgain});

    // Only marketplace deploy
    // deployer.deploy(MarketplaceProxy, {gas: 6720000, overwrite: deployAgain})
    // .then(() => {
    //   return deployer.deploy(Marketplace, MarketplaceProxy.address, {gas: 6720000, overwrite: deployAgain});
    // });

  } else {
    deployer.deploy(SaverProxy, {gas: 6720000, overwrite: deployAgain}).then(() => {
      return deployer.deploy(MarketplaceProxy, {gas: 6720000, overwrite: deployAgain});
    }).then(() => {
      return deployer.deploy(Marketplace, MarketplaceProxy.address, {gas: 6720000, overwrite: deployAgain});
    }).then(() => {
      return deployer.deploy(Monitor, SaverProxy.address, {gas: 6720000, overwrite: deployAgain});
    });
  }
};

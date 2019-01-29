const SaverProxy = artifacts.require("./SaverProxy.sol");
const Monitor = artifacts.require("./Monitor.sol");
const SaverAuthority = artifacts.require("./SaverAuthority.sol");
const KyberWrapper = artifacts.require("./KyberWrapper.sol");
const Marketplace = artifacts.require("./Marketplace.sol");
const MarketplaceAuthority = artifacts.require("./MarketplaceAuthority.sol");
const MarketplaceProxy = artifacts.require("./MarketplaceProxy.sol");

require('dotenv').config();

module.exports = function(deployer, network) {
  if (network == 'kovan') {
    let deployAgain = (process.env.DEPLOY_AGAIN === 'true') ? true : false
    
    // deployer.deploy(SaverProxy, {gas: 6720000, overwrite: deployAgain}).then(() => {
    //   return deployer.deploy(Monitor, SaverProxy.address, {gas: 6720000, overwrite: deployAgain});
    // }).then(() => {
    //   return deployer.deploy(SaverAuthority, Monitor.address, {gas: 6720000, overwrite: deployAgain});
    // }).then(() => {
    //   return deployer.deploy(KyberWrapper, {gas: 6720000, overwrite: deployAgain});
    // }).then(() => {
    //   return deployer.deploy(MarketplaceProxy, {gas: 6720000, overwrite: deployAgain});
    // }).then(() => {
    //   return deployer.deploy(Marketplace, {gas: 6720000, overwrite: deployAgain});
    // }).then(() => {
    //   return deployer.deploy(MarketplaceAuthority, Marketplace.address, {gas: 6720000, overwrite: deployAgain});
    // });

    // Only marketplace deploy
    deployer.deploy(MarketplaceProxy, {gas: 6720000, overwrite: deployAgain})
    .then(() => {
      return deployer.deploy(Marketplace, MarketplaceProxy.address, {gas: 6720000, overwrite: deployAgain});
    }).then(() => {
      return deployer.deploy(MarketplaceAuthority, Marketplace.address, {gas: 6720000, overwrite: deployAgain});
    });

  } else {
    deployer.deploy(SaverProxy);
  }
};

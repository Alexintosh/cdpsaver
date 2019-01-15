const SaverProxy = artifacts.require("./SaverProxy.sol");
const Monitor = artifacts.require("./Monitor.sol");
const SaverAuthority = artifacts.require("./SaverAuthority.sol");
const KyberWrapper = artifacts.require("./KyberWrapper.sol");

const dotenv = require('dotenv').config();


module.exports = function(deployer, network) {
  if (network == 'kovan') {
    let deployAgain = (process.env.DEPLOY_AGAIN === 'true') ? true : false
    
    deployer.deploy(SaverProxy, {gas: 6720000, overwrite: deployAgain}).then(() => {
      return deployer.deploy(Monitor, SaverProxy.address, {gas: 6720000, overwrite: deployAgain});
    }).then(() => {
      return deployer.deploy(SaverAuthority, Monitor.address, {gas: 6720000, overwrite: deployAgain});
    }).then(() => {
      return deployer.deploy(KyberWrapper, {gas: 6720000, overwrite: deployAgain});
    });

  } else {
    deployer.deploy(SaverProxy);
  }
};

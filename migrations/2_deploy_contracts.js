const SaverProxy = artifacts.require("./SaverProxy.sol");
const Monitor = artifacts.require("./Monitor.sol");
const SaverAuthority = artifacts.require("./SaverAuthority.sol");

const dotenv = require('dotenv').config();


module.exports = function(deployer, network) {
  if (network == 'kovan') {
    if (process.env.DEPLOY_AGAIN == true) {
      deployer.deploy(SaverProxy).then(() => {
        return deployer.deploy(Monitor, SaverProxy.address);
      }).then(() => {
        return deployer.deploy(SaverAuthority, Monitor.address);
      });
    }


  } else {
    deployer.deploy(SaverProxy);
  }
};

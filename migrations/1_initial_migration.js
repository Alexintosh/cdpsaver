var Migrations = artifacts.require("./Migrations.sol");
const dotenv = require('dotenv').config();


module.exports = function(deployer, network) {
  if(network == 'kovan') {

    if (process.env.DEPLOY_AGAIN == true) {
      deployer.deploy(Migrations);
    }
  } else {
    deployer.deploy(Migrations);
  }
};

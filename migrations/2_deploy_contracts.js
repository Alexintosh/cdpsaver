const SaverProxy = artifacts.require("./SaverProxy.sol");
//const Marketplace = artifacts.require("./Marketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(SaverProxy);
  //deployer.deploy(Marketplace);
};

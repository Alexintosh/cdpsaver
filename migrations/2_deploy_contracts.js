const CdpSaver = artifacts.require("./CdpSaver.sol");
const Marketplace = artifacts.require("./Marketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(CdpSaver);
  deployer.deploy(Marketplace);
};

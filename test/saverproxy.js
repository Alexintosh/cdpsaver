const SaverProxy = artifacts.require("./SaverProxy.sol");

contract("SaverProxy", accounts => {
  it("...get the deployed contract", async () => {
    const s = await SaverProxy.deployed(0xe03AE319fA811d0F0F3552827D293153B944eE79);
 
  });
});

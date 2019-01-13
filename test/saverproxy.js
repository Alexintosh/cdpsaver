
const dotenv = require('dotenv').config();

const SaverProxy = artifacts.require("./SaverProxy.sol");
const Monitor = artifacts.require("./Monitor.sol");
const ProxyRegistryInterface = artifacts.require("./ProxyRegistryInterface.sol");
const DSProxy = artifacts.require("./DSProxy.sol");

contract("SaverProxy", accounts => {

  let saver, monitor, proxy;

  const cdpId = process.env.CDPID;
  const cdpIdBytes32 = process.env.CDPID_BYTES;

  before(async () => {


    if (process.env.DEPLOY_AGAIN == true) {
      saver = await SaverProxy.deployed();
      monitor = await Monitor.deployed();

      const registry = await ProxyRegistryInterface.at("0x64a436ae831c1672ae81f674cab8b6775df3475c");
      const proxyAddr = await registry.proxies(accounts[0]);
      proxy = await DSProxy.at(proxyAddr);

    } else {
      saver = await SaverProxy.at("0xA8f27bc4F3557F4e5A7Fa83b111678b162Ba3916");
      monitor = await Monitor.at("0x9A31FAA5799152841FfC53289dD763F9f5EB718b");

      const registry = await ProxyRegistryInterface.at("0x64a436ae831c1672ae81f674cab8b6775df3475c");
      const proxyAddr = await registry.proxies(accounts[0]);
      proxy = await DSProxy.at(proxyAddr);
    }
  });

  function getAbiFunction(contract, functionName) {
    const abi = contract.toJSON().abi;

    return abi.find(abi => abi.name === functionName);
  }

  it('...should print some addresses', async () => {
    console.log(`Saver addr: ${saver.address}, Monitor addr: ${monitor.address}`);
  });


  // it('...should call the repay feature', async () => {

  //   const data = web3.eth.abi.encodeFunctionCall(getAbiFunction(SaverProxy, 'repay'), [cdpId]);

  //   const ratio = await monitor.getRatio.call(cdpIdBytes32);

  //   try {
  //     console.log('Old Ratio: ', ratio.toString());

  //     const tx = await proxy.methods['execute(address,bytes)'](saver.address, data);

  //     const newRatio = await monitor.getRatio.call(cdpIdBytes32);
  //     console.log('Updated ratio: ', newRatio.toString());

  //   } catch(err) {
  //     console.log(err);
  //   }
  // });

  it('...should call repay from the monitor contract', async () => {
    // step 1, subscribe the user

    //step 2, give permission

    //step 3, call the save method
  });

  
});

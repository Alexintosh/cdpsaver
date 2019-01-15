
const dotenv = require('dotenv').config();

const SaverProxy = artifacts.require("./SaverProxy.sol");
const Monitor = artifacts.require("./Monitor.sol");
const ProxyRegistryInterface = artifacts.require("./ProxyRegistryInterface.sol");
const DSProxy = artifacts.require("./DSProxy.sol");
const SaverAuthority = artifacts.require("./SaverAuthority.sol");

contract("SaverProxy", accounts => {

  let saver, monitor, proxy, authority, registry;

  const cdpId = process.env.CDPID;
  const cdpIdBytes32 = process.env.CDPID_BYTES;

  before(async () => {
    saver = await SaverProxy.deployed();
    monitor = await Monitor.deployed();
    authority = await SaverAuthority.deployed();
    const registry = await ProxyRegistryInterface.at("0x64a436ae831c1672ae81f674cab8b6775df3475c");

    const proxyAddr = await registry.proxies(accounts[0]);
    proxy = await DSProxy.at(proxyAddr);
  });

  function getAbiFunction(contract, functionName) {
    const abi = contract.toJSON().abi;

    return abi.find(abi => abi.name === functionName);
  }

  it('...should print some addresses', async () => {
    console.log(`Saver addr: ${saver.address}, Monitor addr: ${monitor.address}, Authority addr: ${authority.address}`);
  });

  it('...should add collateral', async () => {
    const data = web3.eth.abi.encodeFunctionCall(getAbiFunction(SaverProxy, 'lock'), []);
  });

  it('...should draw dai', async () => {
    
  });

  it('...should repay dai', async () => {
    
  });

  it('...should draw collateral', async () => {
    
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

  // it('...should call repay from the monitor contract', async () => {
    
  //   console.log(accounts[1]);

  //   const minRatio = 800; //set really high so we can test it

  //   try {

  //     // step 1, subscribe the user
  //     await monitor.subscribe(cdpIdBytes32, minRatio, {from: accounts[0]});

  //     //step 2, give permission
  //     const tx = await proxy.setAuthority(authority.address, {from: accounts[0]});
  //     //console.log(tx);

  //     //step 3, call the save method
  //     const saveTx = await monitor.saveUser(accounts[0], {from: accounts[0]});

  //     const newRatio = await monitor.getRatio.call(cdpIdBytes32);
  //     console.log('Updated ratio: ', newRatio.toString());
  //     console.log(saveTx);

  //   } catch(err) {
  //     console.log(err);
  //   }
  // });



  // it('...should create a new CDP', async () => {
  //   const daiAmount = web3.utils.toWei("1", 'ether'); //1 dai token
  //   const ethAmount = "0.05";

  //   try {
  //       const tx = await saver.createCdp(daiAmount, 
  //         {from: accounts[2], value: web3.utils.toWei(ethAmount, 'ether')});

  //       console.log(accounts[2], tx);
    
  //   } catch(err) {
  //     console.log(err);
  //   }
  // });



  // it('...should remove proxy ownership', async () => {
  //   try {
  //     const proxyAddr = await registry.proxies(accounts[2]);
  //     const proxyForAccount2 = await DSProxy.at(proxyAddr);

  //     await proxyForAccount2.setOwner("0x0000000000000000000000000000000000000000", {from: accounts[2]});
    
  //   } catch(err) {
  //     console.log(err);
  //   }
  // });

  
});

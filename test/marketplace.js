
const dotenv = require('dotenv').config();

const Marketplace = artifacts.require("./Marketplace.sol");
const MarketplaceAuthority = artifacts.require("./MarketplaceAuthority.sol");
const DSProxy = artifacts.require("./DSProxy.sol");
const SaiProxyInterface = artifacts.require("./SaiProxyInterface.sol");
const ProxyRegistryInterface = artifacts.require("./ProxyRegistryInterface.sol");


contract("SaverProxy", accounts => {

  let marketplace, marketplaceAuthority, registry;
  const tubAddr = "0xa71937147b55Deb8a530C7229C442Fd3F31b7db2";

  const cdpId = process.env.CDPID;
  const cdpIdBytes32 = process.env.CDPID_BYTES;

  before(async () => {
    marketplace = await Marketplace.deployed();
    marketplaceAuthority = await MarketplaceAuthority.deployed();
    registry = await ProxyRegistryInterface.at("0x64a436ae831c1672ae81f674cab8b6775df3475c");
   
    const proxyAddr = await registry.proxies(accounts[0]);
    proxy = await DSProxy.at(proxyAddr);

    saiProxy = await SaiProxyInterface.at("0xadb7c74bce932fc6c27dda3ac2344707d2fbb0e6");
  });

  function getAbiFunction(contract, functionName) {
    const abi = contract.toJSON().abi;

    return abi.find(abi => abi.name === functionName);
  }

  it('...should print some addresses', async () => {
    console.log(`Marketplace addr: ${marketplace.address}, Marketplace authority addr: ${marketplaceAuthority.address}`);
  });

  it('...should add a cdp to the marketplace', async () => {
    try {
        await marketplace.putOnSale(cdpIdBytes32, 3, {from: accounts[0]});

        const item = await marketplace.items(cdpIdBytes32);

        console.log(item.toString());
    } catch(err) {
        console.log(err);
    }
  });

  it('...should remove a cdp to the marketplace', async () => {
    try {
        const tx = await marketplace.cancel(cdpIdBytes32, {from: accounts[0]});

        console.log(tx);
    } catch(err) {
        console.log(err);
    }
  });

});
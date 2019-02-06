
const dotenv = require('dotenv').config();

const Marketplace = artifacts.require("./Marketplace.sol");
const MarketplaceAuthority = artifacts.require("./MarketplaceAuthority.sol");
const MarketplaceProxy = artifacts.require("./MarketplaceProxy.sol");
const DSProxy = artifacts.require("./DSProxy.sol");
const SaiProxyInterface = artifacts.require("./SaiProxyInterface.sol");
const ProxyRegistryInterface = artifacts.require("./ProxyRegistryInterface.sol");

contract("SaverProxy", accounts => {

  let marketplace, marketplaceAuthority, registry;
  const seller = accounts[1];
  const buyer  = accounts[0];
  const tubAddr = "0xa71937147b55Deb8a530C7229C442Fd3F31b7db2";

  const cdpId = 4721;
  const cdpSecondIdBytes32 = "0x0000000000000000000000000000000000000000000000000000000000001306";
  const cdpIdBytes32 = "0x0000000000000000000000000000000000000000000000000000000000001053";

  before(async () => {
    marketplace = await Marketplace.deployed();
    marketplaceProxy = await MarketplaceProxy.deployed();
    marketplaceAuthority = await MarketplaceAuthority.deployed();

    registry = await ProxyRegistryInterface.at("0x64a436ae831c1672ae81f674cab8b6775df3475c");
   
    const proxyAddr = await registry.proxies(seller);
    proxy = await DSProxy.at(proxyAddr);

    saiProxy = await SaiProxyInterface.at("0xadb7c74bce932fc6c27dda3ac2344707d2fbb0e6");
  });

  function getAbiFunction(contract, functionName) {
    const abi = contract.toJSON().abi;

    return abi.find(abi => abi.name === functionName);
  }

  it('...should print some addresses', async () => {
    console.log(`Marketplace addr: ${marketplace.address}, Marketplace authority addr: ${marketplaceAuthority.address},
    Marketplace proxy addr: ${marketplaceProxy.address}`);
  });

    // it('...should authorize the cdp for sale and put it in the marketplace contract', async () => {
    //     try {
    //         const discount = 900;
    //         console.log(cdpIdBytes32, discount, proxy.address, marketplace.address, marketplaceAuthority.address);

    //         const data = web3.eth.abi.encodeFunctionCall(getAbiFunction(MarketplaceProxy, 'authorizeAndSell'),
    //         [cdpIdBytes32, discount, proxy.address, marketplace.address, marketplaceAuthority.address]);

    //         await proxy.methods['execute(address,bytes)'](marketplaceProxy.address, data, {from: seller});

    //         const item = await marketplace.getCdpValue2.call(cdpIdBytes32);

    //         console.log(item);

    //         console.log('Collateral: ' + item[0].toString(), 'Debt: ' + item[1].toString(), 
    //         'value: ' + item[2].toString(), ' without fee: ' + item[3].toString());

    //     } catch(err) {
    //         console.log(err);
    //     }
    // });

    it('...should put 2 cdps on sale and cancel the first one', async () => {
        try {
           
            const data = web3.eth.abi.encodeFunctionCall(getAbiFunction(MarketplaceProxy, 'authorizeAndSell'),
            [cdpIdBytes32, 100, proxy.address, marketplace.address, marketplaceAuthority.address]);
            await proxy.methods['execute(address,bytes)'](marketplaceProxy.address, data, {from: seller});

            const data2 = web3.eth.abi.encodeFunctionCall(getAbiFunction(MarketplaceProxy, 'authorizeAndSell'),
            [cdpSecondIdBytes32, 200, proxy.address, marketplace.address, marketplaceAuthority.address]);
            await proxy.methods['execute(address,bytes)'](marketplaceProxy.address, data2, {from: seller});

            const data3 = web3.eth.abi.encodeFunctionCall(getAbiFunction(MarketplaceProxy, 'cancel'),[marketplace.address, cdpIdBytes32]);
            await proxy.methods['execute(address,bytes)'](marketplaceProxy.address, data3, {from: seller});

            // const data4 = web3.eth.abi.encodeFunctionCall(getAbiFunction(MarketplaceProxy, 'cancel'),[marketplace.address, cdpSecondIdBytes32]);
            // await proxy.methods['execute(address,bytes)'](marketplaceProxy.address, data4, {from: seller});

            let res = await marketplace.isOnSale.call(cdpIdBytes32);

            console.log('First item is on sale: ' + res);

            res = await marketplace.isOnSale.call(cdpSecondIdBytes32);

            console.log('Second item is on sale: ' + res);

        } catch(err) {
            console.log(err);
        }
    });

//   it('...should fail to buy a cdp on marketplace, because not enough money sent', async () => {
//     try {
//         const cdpValue = await marketplace.getCdpValue.call(cdpIdBytes32);
//         const lessMoney = cdpValue[0].sub(new web3.utils.BN(1));

//         const txBuy = await marketplace.buy(cdpIdBytes32, {from: buyer, value: lessMoney});

//         console.log(txBuy);
//     } catch(err) {
//         console.log(err);
//     }
//   });

//   it('...should buy a cdp on marketplace', async () => {
//     try {
//         const cdpValue = await marketplace.getCdpValue.call(cdpIdBytes32);

//         const txBuy = await marketplace.buy(cdpIdBytes32, {from: buyer, value: cdpValue[0].toString()});

//         console.log(txBuy);
//     } catch(err) {
//         console.log(err);
//     }
//   });

//   it('...should remove a cdp to the marketplace', async () => {
//     try {
//         // cancel(address _marketplace, bytes32 _cup)
//         const data = web3.eth.abi.encodeFunctionCall(getAbiFunction(MarketplaceProxy, 'cancel'),
//             [marketplace.address, cdpIdBytes32]);


//         const tx = await proxy.methods['execute(address,bytes)'](marketplaceProxy.address, data, {from: seller});

//         console.log(tx);
        
//     } catch(err) {
//         console.log(err);
//     }
//   });

});
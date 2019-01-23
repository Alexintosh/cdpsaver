# cdpsaver
An online platform to monitor, trade and save your cdps

Visual presentation can be found [here](https://docs.google.com/presentation/d/1ZYRh-KwSvbAEkLTRNYCgPjVeyJq3mjfXQEkkxKN7nss/edit?usp=sharing).

CDP Saver is a web application that aims to help users in protecting their CDPs from liquidation. This will be achieved by several techniques designed to permanently keep CDP liquidation price below the current market price. The most notable feature is internally called Repay and essentially comes down to graceful unwinding - the iterative process of using part of the CDP’s locked collateral in order to repay the part of the debt. CDP Saver will also include some additional features, including a CDP marketplace, CDP boost (reverse repay), intuitive dashboard for general CDP management and as well as a CDP monitoring service.

## Developers 

### Solidity

Truffle is used for deployment and testing of the contracts, the contracts are deployed on the kovan testnet.

Run `truffle migrate --network=kovan` - In order to deply the contracts
Run `truffle test --network=kovan` - In order to run tests

In order to run tests on kovan you'll also need a `.env` file in the root directory of the folder

`.env` file will containt

> ETHEREUM_ACCOUNT_MNEMONIC=[ethreum mnemonic]

> CDPID=[cdp id which your address owns]

> CDPID_BYTES=[cdp id in bytes32]

> DEPLOY_AGAIN=[true|false - weather or not you want the contracts to be redeployed]


A basic overview of the arhitecture can be seen in the diagram below. All interaction with the CDPs will be done with the standard DSProxy and the ownership will never be transfered to us our any of our contracts, only permission will be given through DSAuthority.

![diagram](https://i.imgur.com/YDQkN5W.png)



### Frontend
In order to run the frontend code, navigate to ./client folder
 - run `yarn` (first time)
 - run `yarn dev`
 

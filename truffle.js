const path = require("path");

const dotenv           = require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = process.env.ETHEREUM_ACCOUNT_MNEMONIC;

module.exports = {
  networks: {
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://kovan.infura.io/`, 0, 10);
      },
      network_id: '42',
      gasPrice: 3000000000
      },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/');
      },
      network_id: '4',
    },
    test: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'http://127.0.0.1:8545/');
      },
      network_id: '*',
    },
  },
  compilers: {
    solc: {
      // version: "0.4.24",
    }
 },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")

}

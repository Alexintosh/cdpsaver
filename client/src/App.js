import React, { Component } from "react";
import MarketplaceContract from "./contracts/Marketplace.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(MarketplaceContract);
      Contract.setProvider(web3.currentProvider);
      //const marketplaceInstance = await Contract.deployed();

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };


  render() {
    return (
      <div className="App">
        <h1 className="text-header">Good to Go!</h1>
      </div>
    );
  }
}

export default App;

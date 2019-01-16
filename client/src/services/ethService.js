import {
  SaiSaverProxyContract,
  proxyRegistryInterfaceAddress,
  tubInterfaceAddress,
} from './contractRegistryService';

export const getAccount = () => (
  new Promise(async (resolve, reject) => {
    try {
      const accounts = await window._web3.eth.getAccounts();
      if (!accounts.length) throw new Error('No accounts (Possibly locked)');
      resolve(accounts[0]);
    } catch (err) {
      reject(err);
    }
  })
);

export const getBalance = async (_account) => {
  const account = _account || await getAccount();
  const balanceWei = await window._web3.eth.getBalance(account);
  const balanceEth = window._web3.utils.fromWei(balanceWei);
  // optionally convert to BigNumber here
  // return new window._web3.utils.BN(balanceEth);
  return balanceEth;
};

export const weiToEth = weiVal => window._web3.utils.fromWei(new window._web3.utils.BN(`${weiVal}`));

export const ethToWei = ethVal => window._web3.utils.toWei(`${ethVal}`);

export const getBlockNumber = () => window._web3.eth.getBlockNumber();

export const getNetwork = () => window._web3.eth.net.getId();

/**
 * Returns name of Ethereum network for given ID
 *
 * @return {String}
 */
export const nameOfNetwork = (networkId) => {
  const networks = {
    1: 'Mainnet',
    3: 'Ropsten',
    4: 'Rinkedby',
    42: 'Kovan',
  };
  return networks[networkId] || 'Unknown network';
};

/**
 * Checks if the user has approved to use MM as the provider
 *
 * @return {Promise<*>}
 */
export const isMetaMaskApproved = async () => {
  if (!window.ethereum || !window.ethereum.enable) return true;
  if (window.ethereum._metamask && window.ethereum._metamask.isApproved) return window.ethereum._metamask.isApproved();

  const acc = await window.web3.eth.getAccounts();

  return !!acc.length;
};

export const metamaskApprove = async () => {
  try {
    if (window.ethereum) return window.ethereum.enable();
  } catch (e) {
    throw new Error((e));
  }
};

/**
 * Calls the SaiSaverProxy contract and sends params to create the cdp
 *
 * @param from {String}
 * @param ethAmount {String}
 * @param daiAmount {Number}
 *
 * @return {Promise<Boolean>}
 */
export const createCdp = (from, ethAmount, daiAmount) => new Promise(async (resolve, reject) => {
  const address1 = proxyRegistryInterfaceAddress;
  const address2 = tubInterfaceAddress;

  try {
    const contract = await SaiSaverProxyContract();
    const params = { from, value: window._web3.utils.toWei(ethAmount, 'ether') };

    contract.methods.createOpenLockAndDraw(address1, address2, daiAmount).send(params)
      .on('confirmation', () => { resolve(true); })
      .on('error', reject);
  } catch (err) {
    console.log('ERROR', err);
    reject(err);
  }
});

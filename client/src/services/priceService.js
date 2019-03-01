import { PipInterfaceContract } from './contractRegistryService';

/**
 * Gets the current ETH price
 *
 * @return {Promise<String>}
 */
export const getEthPrice = async () => {
  try {
    const contract = await PipInterfaceContract();
    const price = await contract.methods.read().call();

    return (window._web3.utils.hexToNumberString(price) / 1000000000000000000);
  } catch (err) {
    return err;
  }
};

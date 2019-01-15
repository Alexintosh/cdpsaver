import config from '../config/config.json';
import clientConfig from '../config/clientConfig.json';
import { setupWeb3 } from './web3Service';

setupWeb3();

const proxyRegistryInterfaceAddress = config.ProxyRegistryInterface.networks[clientConfig.network].address;
export const proxyRegistryInterfaceContract = () => new window._web3.eth.Contract(config.ProxyRegistryInterface.abi, proxyRegistryInterfaceAddress); // eslint-disable-line

const saiTubAddress = config.SaiTub.networks[clientConfig.network].address;
export const SaiTubAddressContract = () => new window._web3.eth.Contract(config.SaiTub.abi, saiTubAddress); // eslint-disable-line

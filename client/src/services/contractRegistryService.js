import config from '../config/config.json';
import clientConfig from '../config/clientConfig.json';
import { setupWeb3 } from './web3Service';

setupWeb3();

export const proxyRegistryInterfaceAddress = config.ProxyRegistryInterface.networks[clientConfig.network].address;
export const proxyRegistryInterfaceContract = () => new window._web3.eth.Contract(config.ProxyRegistryInterface.abi, proxyRegistryInterfaceAddress); // eslint-disable-line

export const saiTubAddress = config.SaiTub.networks[clientConfig.network].address;
export const SaiTubContract = () => new window._web3.eth.Contract(config.SaiTub.abi, saiTubAddress); // eslint-disable-line

export const saiSaverProxyAddress = config.SaiSaverProxy.networks[clientConfig.network].address;
export const SaiSaverProxyContract = () => new window._web3.eth.Contract(config.SaiSaverProxy.abi, saiSaverProxyAddress); // eslint-disable-line

export const tubInterfaceAddress = config.TubInterface.networks[clientConfig.network].address;
export const TubInterfaceContract = () => new window._web3.eth.Contract(config.TubInterface.abi, tubInterfaceAddress); // eslint-disable-line

export const daiErc20Address = config.DaiErc20.networks[clientConfig.network].address;
export const DaiErc20Contract = () => new window._web3.eth.Contract(config.DaiErc20.abi, daiErc20Address);

export const makerErc20Address = config.MakerErc20.networks[clientConfig.network].address;
export const MakerErc20Contract = () => new window._web3.eth.Contract(config.MakerErc20.abi, makerErc20Address);

export const marketplaceAddress = config.Marketplace.networks[clientConfig.network].address;
export const marketplaceContract = () => new window._web3.eth.Contract(config.Marketplace.abi, marketplaceAddress);

export const marketplaceProxyAddress = config.MarketplaceProxy.networks[clientConfig.network].address;
export const marketplaceProxyContract = () => new window._web3.eth.Contract(config.MarketplaceProxy.abi, marketplaceProxyAddress); // eslint-disable-line

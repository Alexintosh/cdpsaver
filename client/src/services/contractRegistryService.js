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

export const kyberNetworkProxyAddress = config.KyberNetworkProxy.networks[clientConfig.network].address;
export const KyberNetworkProxyContract = () => new window._web3.eth.Contract(config.KyberNetworkProxy.abi, kyberNetworkProxyAddress); // eslint-disable-line

export const pipInterfaceAddress = config.PipInterface.networks[clientConfig.network].address;
export const PipInterfaceContract = () => new window._web3.eth.Contract(config.PipInterface.abi, pipInterfaceAddress); // eslint-disable-line

export const ethTokenAddress = config.EthToken.networks[clientConfig.network].address;

export const daiTokenAddress = config.DaiToken.networks[clientConfig.network].address;

export const saverProxyAddress = config.SaverProxy.networks[clientConfig.network].address;
export const SaverProxyContract = () => new window._web3.eth.Contract(config.SaverProxy.abi, saverProxyAddress); // eslint-disable-line

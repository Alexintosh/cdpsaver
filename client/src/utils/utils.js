import web3 from 'web3';
import BN from 'bn.js';
import { LS_CDP_SAVER_STATE } from '../constants/general';

/**
 * Takes two rgb arrays and gradient weight and calculates combined rgb color
 *
 * @param color1 {Array}
 * @param color2 {Array}
 * @param weight {Number}
 *
 * @return {*[]}
 */
export const pickHex = (color1, color2, weight) => {
  const w = (weight * 2) - 1;
  const w1 = (w + 1) / 2;
  const w2 = 1 - w1;
  return [Math.round(color1[0] * w1 + color2[0] * w2), Math.round(color1[1] * w1 + color2[1] * w2), Math.round(color1[2] * w1 + color2[2] * w2)]; // eslint-disable-line
};

/**
 * Calculates and returns hex color for handle point on the rainbow slider
 *
 * @param val {Number}
 * @param gradients {Array}
 * @param sliderWidth {Number}
 *
 * @return {Array}
 */
export const getRainbowSliderValColor = (val, gradients, sliderWidth) => {
  let colorRange = [];

  gradients.forEach((value, index) => {
    if (val <= value[0] && (colorRange.length === 0)) {
      colorRange = [index - 1, index];
    }
  });

  // Get the two closest colors
  const firstColor = gradients[colorRange[0]][1];
  const secondColor = gradients[colorRange[1]][1];

  // Calculate ratio between the two closest colors
  const firstColorX = sliderWidth * (gradients[colorRange[0]][0] / 100);
  const secondColorX = (sliderWidth * (gradients[colorRange[1]][0] / 100)) - firstColorX;
  const sliderX = (sliderWidth * (val / 100)) - firstColorX;
  const ratio = sliderX / secondColorX;

  // Get the color with pickHex(thx, less.js's mix function!)
  return pickHex(secondColor, firstColor, ratio);
};

/**
 * Adds decimals to a string number
 *
 * @param num {String}
 * @param decimals {Number}
 *
 * @return {string | *}
 */
export const toDecimal = (num, decimals = 2) => {
  const conditional = num.indexOf('.') !== -1;

  return conditional ? num.substr(0, num.indexOf('.') + decimals + 1) : num;
};

export const isEmptyBytes = string => string === '0x0000000000000000000000000000000000000000';

export const saiTubContractTools = {
  u: (e, t, n) => new Array(t - e.length + 1).join(n || "0") + e, // eslint-disable-line
  formatMethodName: e => web3.utils.sha3(e).substring(0, 10),
  formatProxyAddress: (e) => {
    const t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]; // eslint-disable-line
    let n = web3.utils.toHex(e);

    return n = n.replace('0x', ''), // eslint-disable-line
      n = saiTubContractTools.u(n, 64), // eslint-disable-line
    t && (n = '0x' + n), // eslint-disable-line
      n; // eslint-disable-line
  },
};

/**
 * Returns an instance of the provided contract json
 *
 * @param web3 {Object}
 * @param contractDefinition {Object}
 *
 * @return {Promise<Object>}
 */
export const getContractInstance = async (web3, contractDefinition) => {
  const networkId = await web3.eth.net.getId();
  const deployedAddress = contractDefinition.networks[networkId].address;

  return new web3.eth.Contract(contractDefinition.abi, deployedAddress);
};

/**
 * Finds abi function inside a contract
 *
 * @param contract {Object}
 * @param functionName {String}
 *
 * @return {Object}
 */
export const getAbiFunction = (contract, functionName) => {
  const { abi } = contract.toJSON();
  return abi.find(abi => abi.name === functionName);
};

export const padToBytes32 = (_n) => {
  let n = _n;

  while (n.length < 64) n = `0${n}`;

  return `0x${n}`;
};

export const numStringToBytes32 = (num) => {
  const bn = new BN(num).toTwos(256);
  return padToBytes32(bn.toString(16));
};

export const formatAcc = account => `${account.substring(0, 12)}...${account.substr(account.length - 6)}`;

export const formatAccType = (accType) => {
  if (accType === 'metamask') return 'MetaMask';
};

const countDecimals = (value) => {
  if (Math.floor(value) !== value) return value.toString().split('.')[1].length || 0;

  return 0;
};

export const formatNumber = (_num, fixed) => {
  try {
    let num = _num;

    if (typeof num === 'object') num = num.toNumber();

    if (Number.isInteger(num)) return num;

    const decimals = countDecimals(num);
    const numString = num.toString();

    const formated = numString.substring(0, (numString.length - decimals) + fixed);

    if (formated === 'Infinity') return '0';

    return parseFloat(_num).toFixed(fixed);
  } catch (err) {
    return parseFloat(_num).toFixed(fixed);
  }
};

export const convertDaiToEth = (dai, ethPrice) => dai / ethPrice;

/**
 * Fetches set ls state if it exists and existing item if it exists
 * @param account
 * @return {{oldStateLsVal: Array, existingItem}}
 */
export const getLsExistingItemAndState = (account) => {
  const lsVal = localStorage.getItem(LS_CDP_SAVER_STATE);
  let oldStateLsVal = null;
  let existingItem = null;
  let existingItemIndex = -1;

  if (lsVal) {
    oldStateLsVal = JSON.parse(lsVal);

    existingItemIndex = oldStateLsVal.findIndex(item => item.account === account);
    if (existingItemIndex >= 0) existingItem = oldStateLsVal[existingItemIndex];
  }

  return { oldStateLsVal, existingItem, existingItemIndex };
};

/**
 * Change or set a state item for each address/account
 *
 * @param change {Object}
 */
export const addToLsState = (change) => {
  if (!change.account) throw new Error('You must send account in order to change ls state item value');

  const data = getLsExistingItemAndState(change.account);

  const { existingItem, existingItemIndex } = data;
  let { oldStateLsVal } = data;
  let newStateVal = [];

  if (!oldStateLsVal) oldStateLsVal = [];

  if (!existingItem) {
    newStateVal = [...oldStateLsVal, change];
  } else {
    oldStateLsVal[existingItemIndex] = { ...existingItem, ...change };
    newStateVal = [...oldStateLsVal];
  }

  localStorage.setItem(LS_CDP_SAVER_STATE, JSON.stringify(newStateVal));
};

export const notGraterThan = (val, max) => {
  if (val > max) return max;

  return val;
};

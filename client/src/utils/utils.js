import web3 from 'web3';
import BN from 'bn.js';

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

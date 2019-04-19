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
  formatMethodName: e => window._web3.utils.sha3(e).substring(0, 10),
  formatProxyAddress: (e) => {
    const t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]; // eslint-disable-line
    let n = window._web3.utils.toHex(e);

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
  if (accType === 'trezor') return 'Trezor';
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

export const formatStabilityFee = (fee) => {
  const feeNum = parseFloat(fee);

  if (feeNum < 1) {
    if (feeNum * 100 > 1) {
      return feeNum.toFixed(2);
    // eslint-disable-next-line no-else-return
    } else {
      return feeNum.toExponential(2);
    }
  }

  return feeNum.toFixed(2);
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


/**
 * Switches between reasons why a button is disabled
 *
 * @param executingAction {Boolean}
 * @param noValue {Boolean}
 * @param valueUnderZero {Boolean}
 * @param overMax {Boolean}
 *
 * @return {String}
 */
export const getManageActionErrorText = (executingAction, noValue, valueUnderZero, overMax = false) => {
  let err = '';

  if (overMax) err = 'Value is larger than the max value';
  if (valueUnderZero) err = 'Value can\'t be less than 0';
  if (noValue) err = 'No value entered';
  if (executingAction) err = 'Executing action';

  return err;
};

export const compareAddresses = (addr1, addr2) => addr1.toLowerCase() === addr2.toLowerCase();

/**
 * Checks if the the device that is accessing the site is a mobile device or not
 *
 * @return {boolean}
 */
export const isMobileDevice = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera); // eslint-disable-line
  return check;
};

import { MIN_ETH_COLLATERAL } from '../../../constants/general';

const onboardingCreateCdpFormFormValidator = ({ ethAmount, daiAmount }) => {
  const errors = {};

  if (!ethAmount) errors.ethAmount = 'Required';
  if (!daiAmount) errors.daiAmount = 'Required';

  if (ethAmount && (parseFloat(ethAmount)) <= 0) errors.ethAmount = 'Must be a positive value';
  if (ethAmount && (parseFloat(ethAmount)) < MIN_ETH_COLLATERAL) errors.ethAmount = `Must be over ${MIN_ETH_COLLATERAL}`; // eslint-disable-line
  if (daiAmount && (parseFloat(daiAmount)) <= 0) errors.daiAmount = 'Must be a positive value';

  return errors;
};

export default onboardingCreateCdpFormFormValidator;

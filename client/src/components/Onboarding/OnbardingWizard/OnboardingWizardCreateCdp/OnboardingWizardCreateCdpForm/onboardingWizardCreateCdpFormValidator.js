const onboardingWizardCreateCdpFormValidator = ({ ethAmount, daiAmount }) => {
  const errors = {};

  if (!ethAmount) errors.ethAmount = 'Required';
  if (!daiAmount) errors.daiAmount = 'Required';

  if (ethAmount && (parseFloat(ethAmount)) < 0) errors.ethAmount = 'Must be a positive value';
  if (daiAmount && (parseFloat(daiAmount)) < 0) errors.daiAmount = 'Must be a positive value';

  return errors;
};

export default onboardingWizardCreateCdpFormValidator;

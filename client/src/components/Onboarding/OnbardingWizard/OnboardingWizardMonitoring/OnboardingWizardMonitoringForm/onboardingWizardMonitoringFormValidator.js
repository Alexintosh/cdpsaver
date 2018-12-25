import { EMAIL_REGEX } from '../../../../../constants/general';

const onboardingWizardMonitoringFormValidator = ({ email, ratioPercent }) => {
  const errors = {};

  if (!email) errors.email = 'Required';
  if (!ratioPercent) errors.ratioPercent = 'Required';

  if (ratioPercent && (parseFloat(ratioPercent)) < 0) errors.ratioPercent = 'Must be a positive value';
  // TODO CHECK IF USER CAN PUT LESS THAN 150 PERCENT

  if (email && !EMAIL_REGEX.test(email.toLowerCase())) {
    errors.email = 'Invalid email';
  }

  return errors;
};

export default onboardingWizardMonitoringFormValidator;

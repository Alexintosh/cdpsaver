import { EMAIL_REGEX } from '../../../constants/general';

const onboardingCreateCdpFormFormValidator = ({ email }) => {
  const errors = {};

  if (!email) errors.email = 'Required';
  if (email && !EMAIL_REGEX.test(String(email).toLowerCase())) errors.email = 'Invalid email';

  return errors;
};

export default onboardingCreateCdpFormFormValidator;

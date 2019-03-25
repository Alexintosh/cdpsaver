import { EMAIL_REGEX } from '../../../../constants/general';

const contactUsFromValidator = ({ email, message }) => {
  const errors = {};

  if (!email) errors.email = 'Required';
  if (email && !EMAIL_REGEX.test(String(email).toLowerCase())) errors.email = 'Invalid email';

  if (!message) errors.message = 'Required';

  return errors;
};

export default contactUsFromValidator;

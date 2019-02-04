const sellCdpFormValidator = ({ discount }) => {
  const errors = {};

  if (!discount) errors.discount = 'Required';

  return errors;
};

export default sellCdpFormValidator;

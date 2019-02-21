const sellCdpFormValidator = ({ discount }) => {
  const errors = {};

  if (!discount) errors.discount = 'Required';
  if (discount && discount < 1) errors.discount = 'Must be at least 1%';
  if (discount && discount > 99) errors.discount = "Can't be over 99%";

  return errors;
};

export default sellCdpFormValidator;

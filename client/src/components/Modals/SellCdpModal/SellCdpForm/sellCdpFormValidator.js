const sellCdpFormValidator = ({ sellPrice }) => {
  const errors = {};

  if (!sellPrice) errors.sellPrice = 'Required';

  return errors;
};

export default sellCdpFormValidator;

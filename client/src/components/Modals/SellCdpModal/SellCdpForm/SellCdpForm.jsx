import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import InputComponent from '../../../Forms/InputComponent';
import sellCdpFormValidator from './sellCdpFormValidator';
import { sellCdp } from '../../../../actions/marketplaceActions';

const SellCdpForm = ({ handleSubmit, onSubmit }) => (
  <form
    id="sell-cdp-form"
    onSubmit={handleSubmit((e) => { onSubmit(e); })}
    className="form-wrapper"
  >
    <Field
      id="marketplace-sell-price"
      name="sellPrice"
      placeholder="3"
      type="number"
      labelText="Sell price"
      secondLabelText="%"
      additional={{ min: 1 }}
      component={InputComponent}
      showErrorText
    />
  </form>
);

SellCdpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const SellCdpFormComp = reduxForm({
  form: 'sellCdpForm',
  validate: sellCdpFormValidator,
})(SellCdpForm);

const mapDispatchToProps = {
  onSubmit: sellCdp,
};

export default connect(null, mapDispatchToProps)(SellCdpFormComp);
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import onboardingWizardCreateCdpFormValidator from './onboardingWizardCreateCdpFormValidator';
import InputComponent from '../../../../Forms/InputComponent';
import { createCdpAction } from '../../../../../actions/onboardingActions';

let OnboardingWizardCreateCdpForm = ({ handleSubmit, onSubmit, history }) => (
  <form
    id="onboarding-wizard-create-cdp-form"
    onSubmit={handleSubmit((e) => { onSubmit(e, history); })}
    className="form-wrapper"
  >
    <Field
      id="onboarding-create-cdp-eth-amount"
      name="ethAmount"
      placeholder="1"
      type="number"
      labelText="Amount of ETH:"
      secondLabelText="ETH"
      additional={{ min: 1 }}
      component={InputComponent}
      showErrorText
      focus
    />

    <Field
      id="onboarding-create-cdp-dai-amount"
      name="daiAmount"
      placeholder="1"
      type="number"
      labelText="Amount of DAI:"
      secondLabelText="DAI"
      additional={{ min: 1 }}
      component={InputComponent}
      showErrorText
    />
  </form>
);

OnboardingWizardCreateCdpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

OnboardingWizardCreateCdpForm = reduxForm({
  form: 'onboardingWizardCreateCdpForm',
  validate: onboardingWizardCreateCdpFormValidator,
})(OnboardingWizardCreateCdpForm);

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: createCdpAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardCreateCdpForm);

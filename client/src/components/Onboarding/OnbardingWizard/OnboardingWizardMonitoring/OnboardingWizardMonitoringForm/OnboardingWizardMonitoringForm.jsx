import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import onboardingWizardMonitoringFormValidator from './onboardingWizardMonitoringFormValidator';
import { submitOnboardingMonitoringForm } from '../../../../../actions/onboardingActions';
import InputComponent from '../../../../Forms/InputComponent';

let OnboardingWizardMonitoringForm = ({
  handleSubmit, onSubmit, history, pristine, invalid, submittingForm,
}) => (
  <form
    id="onboarding-wizard-monitoring-form"
    onSubmit={handleSubmit((e) => { onSubmit(e, history); })}
    className="form-wrapper"
  >
    <Field
      id="onboarding-monitoring-email"
      name="email"
      labelText="Email:"
      placeholder="cdplover@makr.com"
      component={InputComponent}
      showErrorText
      focus
    />

    <Field
      id="onboarding-create-cdp-dai-amount"
      name="ratioPercent"
      placeholder="150"
      type="number"
      labelText="Send alert when ratio:"
      secondLabelText="%"
      additional={{ min: 1 }}
      component={InputComponent}
      showErrorText
    />

    <button
      disabled={pristine || invalid || submittingForm}
      className="button green"
      type="submit"
    >
      { submittingForm ? 'Subscribing' : 'Subscribe' }
    </button>
  </form>
);

OnboardingWizardMonitoringForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submittingForm: PropTypes.bool.isRequired,
};

OnboardingWizardMonitoringForm = reduxForm({
  form: 'onboardingWizardMonitoringForm',
  validate: onboardingWizardMonitoringFormValidator,
})(OnboardingWizardMonitoringForm);

const mapStateToProps = ({ onbooarding }) => ({
  submittingForm: false, // subscribingToMonitoring
});

const mapDispatchToProps = {
  onSubmit: submitOnboardingMonitoringForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardMonitoringForm);

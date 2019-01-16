import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import onboardingMonitoringFormValidator from './onboardingMonitoringFormValidator';
import { submitOnboardingMonitoringForm } from '../../../../actions/onboardingActions';
import InputComponent from '../../../Forms/InputComponent';
import CheckboxComponent from '../../../Forms/CheckboxComponent/CheckboxComponent';

let OnboardingMonitoringForm = ({
  handleSubmit, onSubmit, pristine, invalid, submittingForm,
}) => (
  <form
    id="onboarding-monitoring-form"
    onSubmit={handleSubmit((e) => { onSubmit(e); })}
    className="form-wrapper"
  >
    <Field
      id="onboarding-monitoring-email"
      name="email"
      labelText="Email:"
      placeholder="cdplover@makr.com"
      component={InputComponent}
      showErrorText
    />

    <Field
      id="onboarding-monitoring-ratio-percent"
      name="ratioPercent"
      placeholder="150"
      type="number"
      labelText="Send alert when ratio:"
      secondLabelText="%"
      additional={{ min: 1 }}
      component={InputComponent}
      showErrorText
    />

    <Field
      id="onboarding-monitoring-weekly-info"
      name="weeklyInfo"
      type="checkbox"
      labelText="Weekly info"
      component={CheckboxComponent}
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

OnboardingMonitoringForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submittingForm: PropTypes.bool.isRequired,
};

OnboardingMonitoringForm = reduxForm({
  form: 'onboardingMonitoringForm',
  validate: onboardingMonitoringFormValidator,
})(OnboardingMonitoringForm);

const mapStateToProps = ({ onboarding }) => ({
  submittingForm: onboarding.subscribingToMonitoring,
});

const mapDispatchToProps = {
  onSubmit: submitOnboardingMonitoringForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingMonitoringForm);

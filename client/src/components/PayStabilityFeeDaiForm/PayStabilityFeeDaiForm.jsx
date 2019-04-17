import React from 'react';
import { reduxForm, Field } from 'redux-form';
import CheckboxComponent from '../Forms/CheckboxComponent/CheckboxComponent';

const PayStabilityFeeDaiForm = () => (
  <form onSubmit={() => {}} className="form-wrapper">
    <Field
      id="onboarding-monitoring-weekly-info"
      name="payWithDai"
      type="checkbox"
      labelText="Pay stability fee with DAI:"
      component={CheckboxComponent}
    />
  </form>
);

const PayStabilityFeeDaiFormComp = reduxForm({
  form: 'payStabilityFeeDaiForm',
})(PayStabilityFeeDaiForm);

export default PayStabilityFeeDaiFormComp;

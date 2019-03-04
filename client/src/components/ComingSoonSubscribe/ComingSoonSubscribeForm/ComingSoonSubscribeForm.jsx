import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import comingSoonSubscribeFormValidator from './comingSoonSubscribeFormValidator';
import { subscribeComingSoonAction } from '../../../actions/generalActions';

const ComingSoonSubscribeForm = ({
  handleSubmit, onSubmit, pristine, invalid, submittingForm, submittingFormError,
}) => (
  <form onSubmit={handleSubmit((e) => { onSubmit(e); })} className="form-wrapper">
    <Field
      id="subscribe-email"
      name="email"
      placeholder="Email"
      labelText="Email address:"
      component={InputComponent}
      showErrorText
      focus
    />

    { !submittingForm && submittingFormError && <div className="submit-error">{submittingFormError}</div> }

    <div className="submit-wrapper">
      <button
        type="submit"
        disabled={pristine || invalid || submittingForm}
        className="button green uppercase"
      >
        { submittingForm ? 'Subscribing' : 'Subscribe' }
      </button>
    </div>
  </form>
);

const ComingSoonSubscribeFormComp = reduxForm({
  form: 'comingSoonSubscribeForm',
  validate: comingSoonSubscribeFormValidator,
})(ComingSoonSubscribeForm);

ComingSoonSubscribeForm.propTypes = {
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submittingForm: PropTypes.bool.isRequired,
  submittingFormError: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = ({ general }) => ({
  submittingForm: general.subscribingComingSoon,
  submittingFormError: general.subscribingComingSoonError,
});

const mapDispatchToProps = {
  onSubmit: subscribeComingSoonAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoonSubscribeFormComp);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import InputComponent from '../../../Forms/InputComponent';
import contactUsFromValidator from './contactUsFromValidator';
import TextAreaComponent from '../../../Forms/TextAreaComponent';
import { submitContactUs, resetContactUs } from '../../../../actions/generalActions';

class ContactUsForm extends Component {
  componentWillMount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  componentWillUnmount() {
    this.props.resetContactUs();
  }

  render() {
    const {
      handleSubmit, onSubmit, submittingForm, submittingFormError, closeModal,
    } = this.props;

    return (
      <form
        id="contact-us-form"
        onSubmit={handleSubmit((e) => { onSubmit(e, closeModal); })}
        className="form-wrapper"
      >
        <Field
          id="contact-email"
          name="email"
          placeholder="Email"
          labelText="Email address:"
          component={InputComponent}
          showErrorText
          focus
        />

        <Field
          labelText="Message:"
          id="contact-message"
          placeholder="Message"
          name="message"
          showErrorText
          component={TextAreaComponent}
        />

        { !submittingForm && submittingFormError && <div className="submit-error">{submittingFormError}</div> }
      </form>
    );
  }
}

const ComingSoonSubscribeFormComp = reduxForm({
  form: 'contactUsForm',
  validate: contactUsFromValidator,
})(ContactUsForm);

ContactUsForm.propTypes = {
  submittingForm: PropTypes.bool.isRequired,
  submittingFormError: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetContactUs: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

const mapStateToProps = ({ general }) => ({
  submittingForm: general.sendingContactUs,
  submittingFormError: general.sendingContactUsError,
});

const mapDispatchToProps = {
  onSubmit: submitContactUs, resetContactUs,
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoonSubscribeFormComp);

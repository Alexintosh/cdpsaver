import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isInvalid, isPristine } from 'redux-form';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import ContactUsForm from './ContactUsForm/ContactUsForm';

import './ContactUsModal.scss';

const ContactUsModal = ({
  closeModal, pristine, invalid, submittingForm,
}) => (
  <div className="contact-us-modal-wrapper">
    <ModalHeader closeModal={closeModal} />

    <ModalBody>
      <div className="title">Contact us</div>
      <div className="description">
        If you have any questions or suggestions, feel free to reach out to us using the contact form below.
        We will get back to you as soon as possible.
      </div>

      <ContactUsForm closeModal={closeModal} />
    </ModalBody>

    <div className="modal-controls">
      <button
        disabled={pristine || invalid || submittingForm}
        form="contact-us-form"
        type="submit"
        className="button green uppercase"
      >
        { submittingForm ? 'Sending' : 'Send' }
      </button>
    </div>
  </div>
);

ContactUsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  submittingForm: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  pristine: isPristine('contactUsForm')(state),
  invalid: isInvalid('contactUsForm')(state),
  submittingForm: state.general.sendingContactUs,
});

export default connect(mapStateToProps)(ContactUsModal);

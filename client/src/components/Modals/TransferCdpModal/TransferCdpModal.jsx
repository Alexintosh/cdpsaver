import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import ModalBody from '../ModalBody';
import ModalHeader from '../ModalHeader';
import TransferCdpForm from './TransferCdpForm/TransferCdpForm';

import './TransferCdpModal.scss';

let TransferCdpModal = ({
  closeModal, cdpId, pristine, invalid, submittingForm, submittingFormError, history,
  formValues, account,
}) => (
  <div id="transfer-cdp-modal-wrapper" className={submittingFormError ? 'form-error' : ''}>
    <ModalHeader closeModal={closeModal} />

    <ModalBody>
      <div className="modal-content">
        <h3 className="title">Transfer CDP</h3>

        <div className="sub-header">
          <span className="label">CDP ID:</span>
          <span className="value">#{ cdpId }</span>
        </div>

        <div className="description">
          By transfering your CDP to a new address you will give up ownership of it.
        </div>

        <TransferCdpForm history={history} closeModal={closeModal} />

        { !submittingForm && submittingFormError && (<div className="form-error">{submittingFormError}</div>) }
      </div>
    </ModalBody>

    <div className="modal-controls">
      <button
        type="submit"
        disabled={
          pristine || invalid || submittingForm || !formValues.toAddress ||
          (formValues.toAddress && !window._web3.utils.isAddress(formValues.toAddress)) ||
          (formValues.toAddress === account)
        }
        className="button green uppercase"
        form="transfer-cdp-form"
      >
        { submittingForm ? 'Transfering' : 'Transfer' }
      </button>
    </div>
  </div>
);

TransferCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  cdpId: PropTypes.number.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submittingForm: PropTypes.bool.isRequired,
  submittingFormError: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
};

TransferCdpModal = reduxForm({
  form: 'transferCdpForm',
})(TransferCdpModal);

const selector = formValueSelector('transferCdpForm');

const mapStateToProps = state => ({
  formValues: {
    toAddress: selector(state, 'toAddress'),
  },
  cdpId: state.general.cdp ? state.general.cdp.id : 0,
  account: state.general.account,
  submittingForm: state.dashboard.transferringCdp,
  submittingFormError: state.dashboard.transferringCdpError,
});

export default connect(mapStateToProps)(TransferCdpModal);

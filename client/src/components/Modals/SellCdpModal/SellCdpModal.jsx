import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isPristine, isInvalid } from 'redux-form';
import ModalBody from '../ModalBody';
import ModalHeader from '../ModalHeader';
import SellCdpForm from './SellCdpForm/SellCdpForm';
import { resetSellCdpForm } from '../../../actions/marketplaceActions';

import './SellCdpModal.scss';

class SellCdpModal extends Component {
  componentWillUnmount() {
    this.props.resetSellCdpForm();
  }

  render() {
    const {
      closeModal, pristine, invalid, submittingForm, submittingFormSuccess,
    } = this.props;

    return (
      <div className="sell-cdp-modal-wrapper">
        <ModalHeader closeModal={closeModal} actionHeader actionText="Approve" />

        <ModalBody>
          {
            !submittingFormSuccess && (
              <div className="modal-content">
                <h3 className="title">Put on sale</h3>

                <div className="info-wrapper">
                  <div className="value-wrapper">
                    <span className="label">Cdp value:</span>
                    <span className="value">3.6 ETH</span>
                  </div>

                  <div className="equation">
                    (Collateral - dept = cdp value)
                  </div>
                </div>

                <SellCdpForm />

                <div className="form-under-label">Lower than value</div>

                <div className="current-sale-price-wrapper">
                  <span className="label">Current sale price:</span>
                  <span className="value">3.5 ETH</span>
                </div>
              </div>
            )
          }

          {
            submittingFormSuccess && (
              <div className="modal-content">
                <h3 className="title">You have successfully put your CDP on sale!</h3>

                <div className="actions-wrapper">Add actions to take after this</div>
              </div>
            )
          }
        </ModalBody>

        <div className="modal-controls">
          {
            !submittingFormSuccess && (
              <button
                disabled={pristine || invalid || submittingForm}
                form="sell-cdp-form"
                type="submit"
                className="button green uppercase"
              >
                Sell
              </button>
            )
          }

          {
            submittingFormSuccess && (
              <button type="button" className="button green uppercase" onClick={closeModal}>
                Close
              </button>
            )
          }
        </div>
      </div>
    );
  }
}

SellCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  resetSellCdpForm: PropTypes.func.isRequired,
  submittingForm: PropTypes.bool.isRequired,
  submittingFormSuccess: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  pristine: isPristine('sellCdpForm')(state),
  invalid: isInvalid('sellCdpForm')(state),
  submittingForm: state.marketplace.sellingCdp,
  submittingFormSuccess: state.marketplace.sellingCdpSuccess,
});

const mapDispatchToProps = {
  resetSellCdpForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellCdpModal);

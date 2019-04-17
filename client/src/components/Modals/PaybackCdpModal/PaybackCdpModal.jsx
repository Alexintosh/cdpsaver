import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getCloseDataAction } from '../../../actions/generalActions';
import { paybackDaiAction } from '../../../actions/dashboardActions';
import ModalHeader from '../ModalHeader';
import LockUnlockInterface from '../../LockUnlockInterface/LockUnlockInterface';
import Loader from '../../Loader/Loader';
import PayStabilityFeeDaiForm from '../../PayStabilityFeeDaiForm/PayStabilityFeeDaiForm';

import '../CloseCdpModal/CloseCdpModal.scss';

class PaybackCdpModal extends Component {
  componentWillMount() {
    this.props.getCloseDataAction(true, parseFloat(this.props.paybackAmount));
  }

  render() {
    const {
      closeModal, enoughMkrToWipe, enoughDaiToWipe, daiUnlocked, makerUnlocked, gettingCloseData,
      gettingCloseDataError, cdpId, paybackDaiAction, payingBackDai, paybackAmount, payWithDai,
    } = this.props;

    const cantClose = !daiUnlocked || !makerUnlocked;

    return (
      <div className="close-cdp-modal-wrapper">
        <ModalHeader closeModal={closeModal} actionHeader actionText="Close" />

        <div className="modal-content">
          <h3 className="title">Payback</h3>

          <div className="container">
            <div className="sub-header">
              <span className="label">CDP ID: </span>
              <span className="value">#{ cdpId }</span>
            </div>
          </div>

          {
            gettingCloseData && (
              <div className="container">
                <div className="loading-wrapper">
                  <Loader />
                </div>
              </div>
            )
          }

          {
            !gettingCloseData && gettingCloseDataError && (
              <div className="container">
                <div className="error-wrapper main-error">{gettingCloseDataError}</div>
              </div>
            )
          }

          {
            !gettingCloseData && !gettingCloseDataError && (
              <div className={`content-wrapper ${cantClose ? 'no-close-cdp' : 'can-close-cdp'}`}>
                <div className="container">
                  <div className="description">
                    <div className="text">
                      Paying back your debt will lower your liquidation price. While paying
                      the debt in Dai you will also be paying the governance fee in MKR.
                    </div>
                  </div>
                </div>

                {
                  enoughDaiToWipe && (
                    <div>
                      { cantClose && (<div className="container"><LockUnlockInterface /></div>) }

                      {
                        !cantClose && !enoughMkrToWipe && (
                          <div className="container pay-with-dai-wrapper">
                            <div className="mkr-error-wrapper">You don’t have Mkr tokens to pay stability fee</div>

                            <PayStabilityFeeDaiForm />
                          </div>
                        )
                      }

                      <div className="modal-controls">
                        <button
                          disabled={cantClose || payingBackDai || (!enoughMkrToWipe && !payWithDai)}
                          type="button"
                          onClick={() => { paybackDaiAction(paybackAmount, closeModal); }}
                          className={`
                            button ${cantClose || (!enoughMkrToWipe && !payWithDai) ? 'gray' : 'green'} uppercase
                          `}
                        >
                          Payback
                        </button>
                      </div>
                    </div>
                  )
                }

                {
                  !enoughDaiToWipe && (
                    <div className="container">
                      <div className="no-close">
                        You do not have enough tokens to payback your CDP at this moment.
                      </div>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

PaybackCdpModal.defaultProps = {
  payWithDai: false,
};

PaybackCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  paybackDaiAction: PropTypes.func.isRequired,
  getCloseDataAction: PropTypes.func.isRequired,
  enoughMkrToWipe: PropTypes.bool.isRequired,
  enoughDaiToWipe: PropTypes.bool.isRequired,
  daiUnlocked: PropTypes.bool.isRequired,
  makerUnlocked: PropTypes.bool.isRequired,
  gettingCloseData: PropTypes.bool.isRequired,
  payingBackDai: PropTypes.bool.isRequired,
  gettingCloseDataError: PropTypes.string.isRequired,
  cdpId: PropTypes.number.isRequired,
  paybackAmount: PropTypes.string.isRequired,
  payWithDai: PropTypes.bool,
};

const selector = formValueSelector('payStabilityFeeDaiForm');

const mapStateToProps = state => ({
  enoughMkrToWipe: state.general.enoughMkrToWipe,
  enoughDaiToWipe: state.general.enoughDaiToWipe,
  daiUnlocked: state.general.daiUnlocked,
  makerUnlocked: state.general.makerUnlocked,
  gettingCloseData: state.general.gettingCloseData,
  gettingCloseDataError: state.general.gettingCloseDataError,
  cdpId: state.general.cdp.id,
  payingBackDai: state.dashboard.payingBackDai,
  payWithDai: selector(state, 'payWithDai'),
});

const mapDispatchToProps = {
  getCloseDataAction, paybackDaiAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaybackCdpModal);

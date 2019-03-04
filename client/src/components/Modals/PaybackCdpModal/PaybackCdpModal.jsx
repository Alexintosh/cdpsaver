import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getCloseDataAction } from '../../../actions/generalActions';
import { paybackDaiAction } from '../../../actions/dashboardActions';
import ModalHeader from '../ModalHeader';
import LockUnlockInterface from '../../LockUnlockInterface/LockUnlockInterface';

import '../CloseCdpModal/CloseCdpModal.scss';
import Loader from '../../Loader/Loader';

class PaybackCdpModal extends Component {
  componentWillMount() {
    this.props.getCloseDataAction(true);
  }

  render() {
    const {
      closeModal, enoughMkrToWipe, enoughEthToWipe, daiUnlocked, makerUnlocked, gettingCloseData,
      gettingCloseDataError, cdpId, paybackDaiAction, payingBackDai, paybackAmount,
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
                <div className="error-wrapper">{gettingCloseDataError}</div>
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
                  enoughMkrToWipe && (
                    <div>
                      { cantClose && (<div className="container"><LockUnlockInterface /></div>) }

                      <div className="modal-controls">
                        <button
                          disabled={cantClose || payingBackDai}
                          type="button"
                          onClick={() => { paybackDaiAction(paybackAmount, closeModal); }}
                          className={`button ${cantClose ? 'gray' : 'green'} uppercase`}
                        >
                          Payback
                        </button>
                      </div>
                    </div>
                  )
                }

                {
                  !enoughMkrToWipe && !enoughEthToWipe && (
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
};

PaybackCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  paybackDaiAction: PropTypes.func.isRequired,
  getCloseDataAction: PropTypes.func.isRequired,
  enoughMkrToWipe: PropTypes.bool.isRequired,
  enoughEthToWipe: PropTypes.bool.isRequired,
  daiUnlocked: PropTypes.bool.isRequired,
  makerUnlocked: PropTypes.bool.isRequired,
  gettingCloseData: PropTypes.bool.isRequired,
  payingBackDai: PropTypes.bool.isRequired,
  gettingCloseDataError: PropTypes.string.isRequired,
  cdpId: PropTypes.number.isRequired,
  paybackAmount: PropTypes.string.isRequired,
};

const mapStateToProps = ({ general, dashboard }) => ({
  enoughMkrToWipe: general.enoughMkrToWipe,
  enoughEthToWipe: general.enoughEthToWipe,
  daiUnlocked: general.daiUnlocked,
  makerUnlocked: general.makerUnlocked,
  gettingCloseData: general.gettingCloseData,
  gettingCloseDataError: general.gettingCloseDataError,
  cdpId: general.cdp.id,
  payingBackDai: dashboard.payingBackDai,
});

const mapDispatchToProps = {
  getCloseDataAction, paybackDaiAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaybackCdpModal);

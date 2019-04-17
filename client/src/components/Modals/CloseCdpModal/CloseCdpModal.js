import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getCloseDataAction } from '../../../actions/generalActions';
import { closeCdpAction } from '../../../actions/dashboardActions';
import ModalHeader from '../ModalHeader';
import LockUnlockInterface from '../../LockUnlockInterface/LockUnlockInterface';

import './CloseCdpModal.scss';
import Loader from '../../Loader/Loader';

class CloseCdpModal extends Component {
  componentWillMount() {
    this.props.getCloseDataAction();
  }

  render() {
    const {
      closeModal, enoughMkrToWipe, enoughDaiToWipe, daiUnlocked, makerUnlocked, gettingCloseData,
      gettingCloseDataError, cdpId, closeCdpAction, history, closingCdp,
    } = this.props;

    const cantClose = !daiUnlocked || !makerUnlocked;

    return (
      <div className="close-cdp-modal-wrapper">
        <ModalHeader closeModal={closeModal} actionHeader actionText="Close" />

        <div className="modal-content">
          <h3 className="title">Close CDP</h3>

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
                <div className="contrainer">
                  <div className="description">
                    <div className="text">
                    Closing your CDP requires paying back all of your Dai and MKR debt.
                    By closing the CDP you will no longer be able to interact with it.
                    </div>
                  </div>
                </div>

                {
                  enoughMkrToWipe && (
                    <div>
                      { cantClose && (<div className="container"><LockUnlockInterface /></div>) }

                      <div className="modal-controls">
                        <button
                          disabled={cantClose || closingCdp}
                          type="button"
                          onClick={() => { closeCdpAction(closeModal, history); }}
                          className={`button ${cantClose ? 'gray' : 'green'} uppercase`}
                        >
                          Close cdp
                        </button>
                      </div>
                    </div>
                  )
                }

                {
                  !enoughDaiToWipe && (
                    <div className="container">
                      <div className="no-close">
                        You do not have enough tokens to close your CDP at this moment.
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

CloseCdpModal.defaultProps = {
};

CloseCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  getCloseDataAction: PropTypes.func.isRequired,
  closeCdpAction: PropTypes.func.isRequired,
  enoughMkrToWipe: PropTypes.bool.isRequired,
  enoughDaiToWipe: PropTypes.bool.isRequired,
  daiUnlocked: PropTypes.bool.isRequired,
  makerUnlocked: PropTypes.bool.isRequired,
  gettingCloseData: PropTypes.bool.isRequired,
  closingCdp: PropTypes.bool.isRequired,
  gettingCloseDataError: PropTypes.string.isRequired,
  cdpId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  payWithDai: PropTypes.bool.isRequired,
};

const selector = formValueSelector('payStabilityFeeDaiForm');

const mapStateToProps = ({ general, dashboard }) => ({
  enoughMkrToWipe: general.enoughMkrToWipe,
  enoughDaiToWipe: general.enoughDaiToWipe,
  daiUnlocked: general.daiUnlocked,
  makerUnlocked: general.makerUnlocked,
  gettingCloseData: general.gettingCloseData,
  gettingCloseDataError: general.gettingCloseDataError,
  closingCdp: dashboard.closingCdp,
  cdpId: general.cdp.id,
  payWithDai: selector(state, 'payWithDai'),
});

const mapDispatchToProps = {
  getCloseDataAction, closeCdpAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseCdpModal);

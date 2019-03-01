import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getCloseDataAction } from '../../../actions/generalActions';
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
      closeModal, enoughMkrToWipe, enoughEthToWipe, daiUnlocked, makerUnlocked, gettingCloseData,
      gettingCloseDataError, cdpId,
    } = this.props;

    const cantClose = !daiUnlocked || !makerUnlocked;

    return (
      <div className="close-cdp-modal-wrapper">
        <ModalHeader closeModal={closeModal} actionHeader actionText="Close" />

        <div className="modal-content">
          <h3 className="title">Close CDP</h3>

          <div className="container">
            <div className="sub-header">
              <span className="label">CDP ID:</span>
              <span className="value">{ cdpId }</span>
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
              <div className="content-wrapper">
                <div className="container">
                  <div className="description">
                    What is the overall collateral ratio of the system (lowest, higest point of the week)
                    How much dai is in the system,How much dai is in the system,
                  </div>
                </div>

                {
                  enoughMkrToWipe && (
                    <div>
                      { cantClose && (<div className="container"><LockUnlockInterface /></div>) }

                      <div className="modal-controls">
                        <button
                          disabled={cantClose}
                          type="button"
                          className={`button ${cantClose ? 'gray' : 'green'} uppercase`}
                        >
                          Close cdp
                        </button>
                      </div>
                    </div>
                  )
                }

                {
                  !enoughMkrToWipe && !enoughEthToWipe && (
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
  enoughMkrToWipe: PropTypes.bool.isRequired,
  enoughEthToWipe: PropTypes.bool.isRequired,
  daiUnlocked: PropTypes.bool.isRequired,
  makerUnlocked: PropTypes.bool.isRequired,
  gettingCloseData: PropTypes.bool.isRequired,
  gettingCloseDataError: PropTypes.string.isRequired,
  cdpId: PropTypes.number.isRequired,
};

const mapStateToProps = ({ general }) => ({
  enoughMkrToWipe: general.enoughMkrToWipe,
  enoughEthToWipe: general.enoughEthToWipe,
  daiUnlocked: general.daiUnlocked,
  makerUnlocked: general.makerUnlocked,
  gettingCloseData: general.gettingCloseData,
  gettingCloseDataError: general.gettingCloseDataError,
  cdpId: general.cdp.id,
});

const mapDispatchToProps = {
  getCloseDataAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseCdpModal);

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getCloseDataAction } from '../../../actions/generalActions';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';

class CloseCdpModal extends Component {
  componentWillMount() {
    this.props.getCloseDataAction();
  }

  render() {
    const {
      closeModal, enoughMkrToWipe, enoughEthToWipe, daiUnlocked, makerUnlocked, gettingCloseData,
      gettingCloseDataError,
    } = this.props;

    return (
      <div className="sell-cdp-modal-wrapper">
        <ModalHeader closeModal={closeModal} actionHeader actionText="Close" />

        <ModalBody>
          { gettingCloseData && (<div className="loading-wrapper">Loading data...</div>) }

          {
            gettingCloseData && gettingCloseDataError && (
              <div className="error-wrapper">
                There was an error while fetching data, please refresh the page.
              </div>
            )
          }

          {
            !gettingCloseData && !gettingCloseDataError && (
              <div className="content-wrapper">
                { enoughMkrToWipe && (<div className="maker-close">close with tokens</div>) }

                { !enoughMkrToWipe && enoughEthToWipe && (<div className="eth-close">close with ether</div>) }

                { !enoughMkrToWipe && !enoughEthToWipe && (<div className="no-close">no close</div>) }
              </div>
            )
          }
        </ModalBody>
      </div>
    );
  }
}

CloseCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  getCloseDataAction: PropTypes.func.isRequired,
  enoughMkrToWipe: PropTypes.bool.isRequired,
  enoughEthToWipe: PropTypes.bool.isRequired,
  daiUnlocked: PropTypes.bool.isRequired,
  makerUnlocked: PropTypes.bool.isRequired,
  gettingCloseData: PropTypes.bool.isRequired,
  gettingCloseDataError: PropTypes.string.isRequired,
};

const mapStateToProps = ({ general }) => ({
  enoughMkrToWipe: general.enoughMkrToWipe,
  enoughEthToWipe: general.enoughEthToWipe,
  daiUnlocked: general.daiUnlocked,
  makerUnlocked: general.makerUnlocked,
  gettingCloseData: general.gettingCloseData,
  gettingCloseDataError: general.gettingCloseDataError,
});

const mapDispatchToProps = {
  getCloseDataAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseCdpModal);

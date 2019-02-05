import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalBody from '../ModalBody';
import ModalHeader from '../ModalHeader';
import { cancelSellCdpAction, resetCancelSellCdp } from '../../../actions/marketplaceActions';

import './CancelSellCdpModal.scss';

class CancelSellCdpModal extends Component {
  componentWillUnmount() {
    this.props.resetCancelSellCdp();
  }

  render() {
    const {
      closeModal, canceling, cancelingSuccess, cancelingError, cancelSellCdpAction,
    } = this.props;

    return (
      <div className={`cancel-sell-cdp-modal-wrapper ${cancelingSuccess ? 'error' : ''}`}>
        <ModalHeader closeModal={closeModal} />

        <ModalBody>
          {
            !cancelingSuccess && (
              <div className="modal-content">
                <h3 className="title">Cancel sale and remove from the marketplace</h3>
              </div>
            )
          }

          {
            cancelingSuccess && (
              <div className="modal-content">
                <h3 className="title">You have successfully canceled the sale of your CDP!</h3>
              </div>
            )
          }
        </ModalBody>

        {
          cancelingError && (
            <div className="modal-error"><div className="error-content">{cancelingError}</div></div>
          )
        }

        <div className="modal-controls">
          {
            !cancelingSuccess && (
              <button
                onClick={cancelSellCdpAction}
                disabled={canceling}
                type="button"
                className="button green uppercase"
              >
                { canceling ? 'Canceling' : 'Cancel' } CDP sale
              </button>
            )
          }

          {
            cancelingSuccess && (
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

CancelSellCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  canceling: PropTypes.bool.isRequired,
  cancelingSuccess: PropTypes.bool.isRequired,
  cancelingError: PropTypes.string.isRequired,
  cancelSellCdpAction: PropTypes.func.isRequired,
  resetCancelSellCdp: PropTypes.func.isRequired,
};

const mapStateToProps = ({ marketplace }) => ({
  canceling: marketplace.canceling,
  cancelingSuccess: marketplace.cancelingSuccess,
  cancelingError: marketplace.cancelingError,
});

const mapDispatchToProps = { cancelSellCdpAction, resetCancelSellCdp };

export default connect(mapStateToProps, mapDispatchToProps)(CancelSellCdpModal);

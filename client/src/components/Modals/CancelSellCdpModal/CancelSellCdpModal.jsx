import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalBody from '../ModalBody';
import ModalHeader from '../ModalHeader';
import { cancelSellCdpAction, resetCancelSellCdp } from '../../../actions/marketplaceActions';
import { changeSelectedCdp } from '../../../actions/generalActions';
import CdpSelect from '../../CdpSelect/CdpSelect';

import './CancelSellCdpModal.scss';

class CancelSellCdpModal extends Component {
  componentWillMount() {
    const { cdp, proxyCdps } = this.props;
    const isInProxys = (proxyCdps.findIndex(_cdp => _cdp.id === cdp.id)) !== -1;

    if (!isInProxys) this.props.changeSelectedCdp({ value: proxyCdps[0].id });
  }

  componentWillUnmount() {
    this.props.resetCancelSellCdp();
  }

  render() {
    const {
      closeModal, canceling, cancelingSuccess, cancelingError, cancelSellCdpAction, proxyCdps,
    } = this.props;

    return (
      <div id="cancel-sell-cdp-modal-wrapper">
        <ModalHeader closeModal={closeModal} />

        <ModalBody>
          {
            !cancelingSuccess && (
              <div className="modal-content">
                <h3 className="title">Cancel sale and remove from the marketplace</h3>

                <CdpSelect additionalClasses="form-item" customCdps={proxyCdps} labelText="CDP ID" />

                {
                  cancelingError && (
                    <div className="modal-error"><div className="error-content">{cancelingError}</div></div>
                  )
                }
              </div>
            )
          }

          {
            cancelingSuccess && (
              <div className="modal-content">
                <h3 className="title success">You have successfully canceled the sale of your CDP!</h3>
              </div>
            )
          }
        </ModalBody>

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
  changeSelectedCdp: PropTypes.func.isRequired,
  resetCancelSellCdp: PropTypes.func.isRequired,
  proxyCdps: PropTypes.array.isRequired,
  cdp: PropTypes.object.isRequired,
};

const mapStateToProps = ({ marketplace, general }) => ({
  canceling: marketplace.canceling,
  cancelingSuccess: marketplace.cancelingSuccess,
  cancelingError: marketplace.cancelingError,
  cdp: general.cdp,
});

const mapDispatchToProps = {
  cancelSellCdpAction, resetCancelSellCdp, changeSelectedCdp,
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelSellCdpModal);

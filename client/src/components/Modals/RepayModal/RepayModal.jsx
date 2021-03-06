import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import Loader from '../../Loader/Loader';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import { repayDaiAction, getRepayModalData, resetRepayModal } from '../../../actions/dashboardActions';
import { formatNumber } from '../../../utils/utils';

class RepayModal extends Component {
  componentWillMount() {
    this.props.getRepayModalData(this.props.ethAmount);
  }

  componentWillUnmount() {
    this.props.resetRepayModal();
  }

  render() {
    const {
      closeModal, repayDaiAmount, repayDaiAction, gettingRepayModalData, ethAmount,
      gettingRepayModalDataError, repayStabilityFee, repayingDai, repayExchangeRate, afterCdp,
    } = this.props;

    const debtDai = afterCdp === null ? false : afterCdp.debtDai;

    return (
      <div className="action-modal-wrapper repay-modal-wrapper">
        <ModalHeader closeModal={closeModal} />

        <ModalBody>
          <div className="description-section">
            <h3 className="title">Repay</h3>

            <div className="description">
            Repaying will draw Ether from your CDP and buy Dai to repay the debt, both in a single transaction.
            This will increase your liquidation price and ratio.
            </div>
          </div>

          <div className="data-section">

            {
              gettingRepayModalData && (
                <div className="container">
                  <div className="loading-wrapper">
                    <Loader />
                  </div>
                </div>
              )
            }

            {
              !gettingRepayModalData && gettingRepayModalDataError && (
                <div className="modal-error"><div className="error-content">{gettingRepayModalDataError}</div></div>
              )
            }

            {
              !gettingRepayModalData && !gettingRepayModalDataError && (
                <React.Fragment>
                  <div className="data-item big">
                    <div className="label">Paying back</div>
                    <div className="value">
                      <TooltipWrapper title={repayDaiAmount}>{ formatNumber(repayDaiAmount, 2) } DAI</TooltipWrapper>
                    </div>
                  </div>

                  <div className="data-item">
                    <div className="label">Stability fee:</div>
                    <div className="value">{repayStabilityFee} MKR</div>
                  </div>

                  {
                    debtDai === 0 && (
                    <div className="data-item">
                      <div className="label">All the debt will be repayed, extra Dai will be sent back to you</div>
                    </div>
                    )
                  }

                  <div className="data-item desc">
                    <div className="label">
                      *Disclaimer: This is an estimate based on current exchange rates.
                    </div>
                    <div className="value">
                      (
                      <TooltipWrapper title={repayExchangeRate}>
                        { `${formatNumber(repayExchangeRate, 2)} ETH/DAI` }
                      </TooltipWrapper>
                      )
                    </div>
                  </div>
                </React.Fragment>
              )
            }
          </div>
        </ModalBody>

        <div className="modal-controls">
          <button
            form="sell-cdp-form"
            type="button"
            disabled={repayingDai}
            onClick={() => { repayDaiAction(ethAmount, repayDaiAmount, closeModal); }}
            className="button green uppercase"
          >
            { repayingDai ? 'Repaying' : 'Repay' }
          </button>
        </div>
      </div>
    );
  }
}

RepayModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  repayDaiAmount: PropTypes.number.isRequired,
  ethAmount: PropTypes.number.isRequired,
  repayExchangeRate: PropTypes.number.isRequired,
  getRepayModalData: PropTypes.func.isRequired,
  repayDaiAction: PropTypes.func.isRequired,
  resetRepayModal: PropTypes.func.isRequired,
  gettingRepayModalData: PropTypes.bool.isRequired,
  gettingRepayModalDataError: PropTypes.string.isRequired,
  repayStabilityFee: PropTypes.number.isRequired,
  repayingDai: PropTypes.bool.isRequired,
  afterCdp: PropTypes.object.isRequired,
};

const mapStateToProps = ({ dashboard }) => ({
  gettingRepayModalData: dashboard.gettingRepayModalData,
  gettingRepayModalDataError: dashboard.gettingRepayModalDataError,
  repayStabilityFee: dashboard.repayStabilityFee,
  repayingDai: dashboard.repayingDai,
  repayDaiAmount: dashboard.repayDaiAmount,
  repayExchangeRate: dashboard.repayExchangeRate,
  afterCdp: dashboard.afterCdp,
});

const mapDispatchToProps = {
  getRepayModalData, repayDaiAction, resetRepayModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(RepayModal);

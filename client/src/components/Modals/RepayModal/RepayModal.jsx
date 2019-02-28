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
      gettingRepayModalDataError, repayStabilityFee, repayingDai, repayExchangeRate,
    } = this.props;

    return (
      <div className="action-modal-wrapper repay-modal-wrapper">
        <ModalHeader closeModal={closeModal} />

        <ModalBody>
          <div className="description-section">
            <h3 className="title">Repay</h3>

            <div className="description">
              What is the overall collateral ratio of the system (lowest, highest point of the week) How much dai is
              in the system,How much dai is in the system,
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

                  <div className="data-item desc">
                    <div className="label">
                      *Disclaimer: This is estimate based on current exchange prices
                    </div>
                    <div className="value">
                      (
                      <TooltipWrapper title={repayExchangeRate}>
                        { `${formatNumber(repayExchangeRate, 2)} DAI/ETH` }
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
            onClick={() => { repayDaiAction(ethAmount, closeModal); }}
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
};

const mapStateToProps = ({ dashboard }) => ({
  gettingRepayModalData: dashboard.gettingRepayModalData,
  gettingRepayModalDataError: dashboard.gettingRepayModalDataError,
  repayStabilityFee: dashboard.repayStabilityFee,
  repayingDai: dashboard.repayingDai,
  repayDaiAmount: dashboard.repayDaiAmount,
  repayExchangeRate: dashboard.repayExchangeRate,
});

const mapDispatchToProps = {
  getRepayModalData, repayDaiAction, resetRepayModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(RepayModal);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import Loader from '../../Loader/Loader';
import { getBoostModalData, resetBoostModal, boostAction } from '../../../actions/dashboardActions';
import { formatNumber } from '../../../utils/utils';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';

class BoostModal extends Component {
  componentWillMount() {
    this.props.getBoostModalData(this.props.boostAmount);
  }

  componentWillUnmount() {
    this.props.resetBoostModal();
  }

  render() {
    const {
      closeModal, gettingBoostModalData, gettingBoostModalDataError, boostAmount, boostEthAmount,
      boostExchangeRate, boosting, boostAction,
    } = this.props;

    return (
      <div className="action-modal-wrapper boost-modal-wrapper">
        <ModalHeader closeModal={closeModal} />

        <ModalBody>
          <div className="description-section">
            <h3 className="title">Boost</h3>

            <div className="description">
              What is the overall collateral ratio of the system (lowest, highest point of the week) How much dai is
              in the system,How much dai is in the system,
            </div>
          </div>

          <div className="data-section">
            {
              gettingBoostModalData && (
                <div className="container">
                  <div className="loading-wrapper">
                    <Loader />
                  </div>
                </div>
              )
            }

            {
              !gettingBoostModalData && gettingBoostModalDataError && (
                <div className="modal-error"><div className="error-content">{gettingBoostModalDataError}</div></div>
              )
            }

            {
              !gettingBoostModalData && !gettingBoostModalDataError && (
                <React.Fragment>
                  <div className="data-item double">
                    <div className="value">
                      <TooltipWrapper title={boostAmount}>
                        { formatNumber(parseFloat(boostAmount), 2) } DAI
                      </TooltipWrapper>
                    </div>
                    <div className="label">will be drawn and converted</div>
                    <div className="value">{ boostEthAmount }</div>
                  </div>

                  <div className="data-item desc">
                    <div className="label">
                      *Disclaimer: This is estimate based on current exchange prices
                    </div>
                    <div className="value">({ boostExchangeRate } DAI/ETH)</div>
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
            disabled={boosting}
            onClick={() => { boostAction(boostAmount, closeModal); }}
            className="button green uppercase"
          >
            { boosting ? 'Boosting' : 'Boost' }
          </button>
        </div>
      </div>
    );
  }
}

BoostModal.propTypes = {
  closeModal: PropTypes.func.isRequired,

  getBoostModalData: PropTypes.func.isRequired,
  gettingBoostModalData: PropTypes.bool.isRequired,
  gettingBoostModalDataError: PropTypes.string.isRequired,

  boostAmount: PropTypes.number.isRequired,
  boostEthAmount: PropTypes.number.isRequired,
  boostExchangeRate: PropTypes.number.isRequired,

  boostAction: PropTypes.func.isRequired,
  resetBoostModal: PropTypes.func.isRequired,
  boosting: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ dashboard }) => ({
  gettingBoostModalData: dashboard.gettingBoostModalData,
  gettingBoostModalDataError: dashboard.gettingBoostModalDataError,
  boostEthAmount: dashboard.boostEthAmount,
  boostExchangeRate: dashboard.boostExchangeRate,
  boosting: dashboard.boosting,
});

const mapDispatchToProps = {
  getBoostModalData, resetBoostModal, boostAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoostModal);
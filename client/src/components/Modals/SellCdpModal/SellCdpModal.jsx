import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isPristine, isInvalid, formValueSelector } from 'redux-form';
import ModalBody from '../ModalBody';
import ModalHeader from '../ModalHeader';
import SellCdpForm from './SellCdpForm/SellCdpForm';
import { resetSellCdpForm } from '../../../actions/marketplaceActions';
import { convertDaiToEth, formatNumber } from '../../../utils/utils';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';

import './SellCdpModal.scss';

class SellCdpModal extends Component {
  componentWillUnmount() {
    this.props.resetSellCdpForm();
  }

  render() {
    const {
      closeModal, pristine, invalid, submittingForm, submittingFormSuccess, cdp,
      ethPrice, discount, submittingFormError,
    } = this.props;

    const value = {
      eth: cdp.depositedETH - convertDaiToEth(cdp.debtDai, ethPrice),
      usd: cdp.depositedUSD - cdp.debtUsd,
    };

    let price = { eth: 0, usd: 0 };

    if (discount) {
      price = {
        eth: value.eth - ((discount / 100) * value.eth),
        usd: value.usd - ((discount / 100) * value.usd),
      };
    }

    const hasDiscount = !isNaN(discount) || discount > 0; /* eslint-disable-line */

    return (
      <div className={`sell-cdp-modal-wrapper ${submittingFormError ? 'error' : ''}`}>
        <ModalHeader closeModal={closeModal} />

        <ModalBody>
          {
            !submittingFormSuccess && (
              <div className="modal-content">
                <h3 className="title">Put on sale</h3>

                <div className="info-wrapper">
                  <div className="value-wrapper">
                    <span className="label">CDP value:</span>
                    <span className="value">
                      <TooltipWrapper title={value.eth}>{ formatNumber(value.eth, 3) } ETH</TooltipWrapper>
                    </span>
                  </div>

                  <div className="equation">
                    (Collateral - Debt = CDP value)
                  </div>
                </div>

                <SellCdpForm />

                <div className="form-under-label">After applied discount</div>

                <div className="current-sale-price-wrapper">
                  <span className="label">Sale price:</span>
                  <span className="value">
                    { !hasDiscount && '-' }
                    {
                      hasDiscount && (
                        <TooltipWrapper title={price.eth}>{ formatNumber(price.eth, 3) } ETH</TooltipWrapper>
                      )
                    }
                  </span>
                </div>
              </div>
            )
          }

          {
            submittingFormSuccess && (
              <div className="modal-content">
                <h3 className="title">You have successfully put your CDP on sale!</h3>
              </div>
            )
          }
        </ModalBody>

        {
          submittingFormError && (
            <div className="modal-error"><div className="error-content">{submittingFormError}</div></div>
          )
        }

        <div className="modal-controls">
          {
            !submittingFormSuccess && (
              <button
                disabled={pristine || invalid || submittingForm}
                form="sell-cdp-form"
                type="submit"
                className="button green uppercase"
              >
                { submittingForm ? 'Selling' : 'Sell' }
              </button>
            )
          }

          {
            submittingFormSuccess && (
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

const selector = formValueSelector('sellCdpForm');

SellCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  resetSellCdpForm: PropTypes.func.isRequired,
  submittingForm: PropTypes.bool.isRequired,
  submittingFormSuccess: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  cdp: PropTypes.object.isRequired,
  ethPrice: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  submittingFormError: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  pristine: isPristine('sellCdpForm')(state),
  invalid: isInvalid('sellCdpForm')(state),
  discount: parseFloat(selector(state, 'discount')),
  submittingForm: state.marketplace.sellingCdp,
  submittingFormSuccess: state.marketplace.sellingCdpSuccess,
  submittingFormError: state.marketplace.sellingCdpError,
  cdp: state.general.cdp,
  ethPrice: state.general.ethPrice,
});

const mapDispatchToProps = {
  resetSellCdpForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellCdpModal);

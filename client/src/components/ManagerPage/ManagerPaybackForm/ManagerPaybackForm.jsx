import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  change, Field, formValueSelector, reduxForm,
} from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import { addCollateralAction, setAfterValue } from '../../../actions/dashboardActions';
import { openBoostModal, openPaybackModal } from '../../../actions/modalActions';
import { formatNumber, notGraterThan } from '../../../utils/utils';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import InfoBox from '../../Decorative/InfoBox/InfoBox';

class ManagerPaybackForm extends Component {
  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      formValues, addingCollateral, addCollateralAction, setAfterValue, afterType,
      openPaybackModal, payingBackDai, dispatch, boosting, maxDaiBoost, gettingMaxDaiBoost,
      openBoostModal, cdp,
    } = this.props;

    const { paybackAmount, addCollateralAmount, boostAmount } = formValues;
    const { debtDai } = cdp;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <div className="item">
          <div
            className={`max-wrapper ${payingBackDai ? 'loading' : ''}`}
            onClick={() => {
              if (!payingBackDai) {
                setAfterValue(debtDai, 'payback');
                dispatch(change('managerPaybackForm', 'paybackAmount', debtDai));
                dispatch(change('managerPaybackForm', 'addCollateralAmount', ''));
                dispatch(change('managerPaybackForm', 'boostAmount', ''));
              }
            }}
          >
            <TooltipWrapper title={debtDai}>
              (max {formatNumber(debtDai, 2)})
            </TooltipWrapper>
          </div>

          <Field
            id="manager-payback-input"
            type="number"
            wrapperClassName={`form-item-wrapper payback ${afterType === 'payback' ? 'active' : ''}`}
            name="paybackAmount"
            onChange={(e) => {
              if (e.target.value <= debtDai) setAfterValue(e.target.value, 'payback');
            }}
            labelText="Payback:"
            secondLabelText="DAI"
            placeholder="0"
            normalize={val => notGraterThan(val, debtDai)}
            additional={{ min: 0, max: debtDai }}
            component={InputComponent}
          />
          <button
            type="button"
            className="button gray uppercase variable-width"
            onClick={() => { openPaybackModal(paybackAmount); }}
            disabled={payingBackDai || !paybackAmount || paybackAmount <= 0 || (paybackAmount > debtDai)}
          >
            { payingBackDai ? 'Paying back' : 'Payback' }
          </button>
        </div>

        <div className="item">
          <Field
            id="manager-add-collateral-input"
            type="number"
            wrapperClassName={`form-item-wrapper collateral ${afterType === 'collateral' ? 'active' : ''}`}
            name="addCollateralAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'collateral'); }}
            labelText="Add collateral:"
            secondLabelText="ETH"
            placeholder="0"
            additional={{ min: 0 }}
            disabled={addingCollateral}
            component={InputComponent}
          />

          <button
            type="button"
            className="button gray uppercase variable-width"
            onClick={() => { addCollateralAction(addCollateralAmount); }}
            disabled={addingCollateral || !addCollateralAmount || addCollateralAmount <= 0}
          >
            { addingCollateral ? 'Adding collateral' : 'Add collateral' }
          </button>
        </div>

        <div className="item">
          <div
            className={`max-wrapper ${boosting ? 'loading' : ''}`}
            onClick={() => {
              if (!boosting) {
                setAfterValue(maxDaiBoost, 'boost');
                dispatch(change('managerPaybackForm', 'paybackAmount', ''));
                dispatch(change('managerPaybackForm', 'addCollateralAmount', ''));
                dispatch(change('managerPaybackForm', 'boostAmount', maxDaiBoost));
              }
            }}
          >
            <TooltipWrapper title={maxDaiBoost}>
              { gettingMaxDaiBoost ? 'Loading...' : `(max ${formatNumber(maxDaiBoost, 2)})` }
            </TooltipWrapper>
          </div>

          <Field
            id="manager-boost-input"
            type="number"
            wrapperClassName={`form-item-wrapper boost ${afterType === 'boost' ? 'active' : ''}`}
            name="boostAmount"
            labelText="Boost:"
            onChange={(e) => {
              if (e.target.value <= maxDaiBoost) setAfterValue(e.target.value, 'boost');
            }}
            secondLabelText="DAI"
            placeholder="0"
            normalize={val => notGraterThan(val, maxDaiBoost)}
            additional={{ min: 0, max: maxDaiBoost }}
            component={InputComponent}
          />

          <div className="item-button-wrapper">
            <InfoBox message="Boost will draw DAI and buy ETH, increasing the amount ETH in the CDP" />

            <button
              type="button"
              className="button gray uppercase"
              onClick={() => { openBoostModal(parseFloat(boostAmount)); }}
              disabled={
                boosting || !boostAmount || (boostAmount <= 0) || (boostAmount > maxDaiBoost)
              }
            >
              Boost
            </button>
          </div>
        </div>
      </form>
    );
  }
}

ManagerPaybackForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAfterValue: PropTypes.func.isRequired,
  afterType: PropTypes.string.isRequired,

  addCollateralAction: PropTypes.func.isRequired,
  addingCollateral: PropTypes.bool.isRequired,

  openPaybackModal: PropTypes.func.isRequired,
  payingBackDai: PropTypes.bool.isRequired,

  openBoostModal: PropTypes.func.isRequired,
  maxDaiBoost: PropTypes.number.isRequired,
  gettingMaxDaiBoost: PropTypes.bool.isRequired,
  boosting: PropTypes.bool.isRequired,

  cdp: PropTypes.object.isRequired,
};

const ManagerPaybackFormComp = reduxForm({ form: 'managerPaybackForm' })(ManagerPaybackForm);

const selector = formValueSelector('managerPaybackForm');

const mapStateToProps = state => ({
  formValues: {
    paybackAmount: selector(state, 'paybackAmount'),
    addCollateralAmount: selector(state, 'addCollateralAmount'),
    boostAmount: selector(state, 'boostAmount'),
  },
  addingCollateral: state.dashboard.addingCollateral,
  payingBackDai: state.dashboard.payingBackDai,

  maxDaiBoost: state.dashboard.maxDaiBoost,
  gettingMaxDaiBoost: state.dashboard.gettingMaxDaiBoost,
  boosting: state.dashboard.boosting,

  afterType: state.dashboard.afterType,

  cdp: state.general.cdp,
});

const mapDispatchToProps = {
  addCollateralAction, openPaybackModal, setAfterValue, openBoostModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPaybackFormComp);

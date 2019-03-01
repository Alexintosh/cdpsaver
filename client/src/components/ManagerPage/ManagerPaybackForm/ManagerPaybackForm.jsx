import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  change, Field, formValueSelector, reduxForm,
} from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import { addCollateralAction, paybackDaiAction, setAfterValue } from '../../../actions/dashboardActions';
import { openBoostModal } from '../../../actions/modalActions';
import { formatNumber } from '../../../utils/utils';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import InfoBox from '../../Decorative/InfoBox/InfoBox';

class ManagerPaybackForm extends Component {
  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      formValues, addingCollateral, addCollateralAction, setAfterValue, afterType,
      paybackDaiAction, payingBackDai, dispatch, boosting, maxDaiBoost, gettingMaxDaiBoost,
      openBoostModal,
    } = this.props;

    const { paybackAmount, addCollateralAmount, boostAmount } = formValues;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <div className="item">
          <Field
            id="manager-payback-input"
            type="number"
            wrapperClassName={`form-item-wrapper payback ${afterType === 'payback' ? 'active' : ''}`}
            name="paybackAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'payback'); }}
            labelText="Payback:"
            secondLabelText="DAI"
            placeholder="0"
            additional={{ min: 0 }}
            component={InputComponent}
          />
          <button
            type="button"
            className="button gray uppercase variable-width"
            onClick={() => { paybackDaiAction(paybackAmount); }}
            disabled={payingBackDai || !paybackAmount || paybackAmount <= 0}
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
            onChange={(e) => { setAfterValue(e.target.value, 'boost'); }}
            secondLabelText="DAI"
            placeholder="0"
            additional={{ min: 0 }}
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

  paybackDaiAction: PropTypes.func.isRequired,
  payingBackDai: PropTypes.bool.isRequired,

  openBoostModal: PropTypes.func.isRequired,
  maxDaiBoost: PropTypes.number.isRequired,
  gettingMaxDaiBoost: PropTypes.bool.isRequired,
  boosting: PropTypes.bool.isRequired,
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
});

const mapDispatchToProps = {
  addCollateralAction, paybackDaiAction, setAfterValue, openBoostModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPaybackFormComp);

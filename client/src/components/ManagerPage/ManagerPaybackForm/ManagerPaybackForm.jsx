import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  change, formValueSelector, reduxForm,
} from 'redux-form';
import { addCollateralAction, setAfterValue } from '../../../actions/dashboardActions';
import { openBoostModal, openPaybackModal } from '../../../actions/modalActions';
import { getManageActionErrorText } from '../../../utils/utils';
import CdpAction from '../CdpAction/CdpAction';

class ManagerPaybackForm extends Component {
  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      formValues, addingCollateral, addCollateralAction, setAfterValue,
      openPaybackModal, payingBackDai, dispatch, boosting, maxDaiBoost, gettingMaxDaiBoost,
      openBoostModal, cdp,
    } = this.props;

    const { paybackAmount, addCollateralAmount, boostAmount } = formValues;
    const { debtDai } = cdp;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <CdpAction
          disabled={payingBackDai || !paybackAmount || paybackAmount <= 0 || (paybackAmount > debtDai)}
          actionExecuting={payingBackDai}
          setValToMax={() => {
            setAfterValue(debtDai, 'payback');
            dispatch(change('managerPaybackForm', 'paybackAmount', debtDai));
            dispatch(change('managerPaybackForm', 'addCollateralAmount', ''));
            dispatch(change('managerPaybackForm', 'boostAmount', ''));
          }}
          maxVal={debtDai.toNumber()}
          gettingMaxVal={false}
          type="payback"
          executingLabel="Paying back"
          toExecuteLabel="Payback"
          info="Payback will return the debt in Dai"
          name="paybackAmount"
          id="manager-payback-input"
          symbol="DAI"
          errorText={getManageActionErrorText(payingBackDai, !paybackAmount, paybackAmount <= 0, paybackAmount > debtDai)} // eslint-disable-line
          executeAction={() => { openPaybackModal(paybackAmount); }}
        />

        <CdpAction
          disabled={addingCollateral || !addCollateralAmount || addCollateralAmount <= 0}
          actionExecuting={addingCollateral}
          setValToMax={() => {}}
          maxVal={0}
          gettingMaxVal={false}
          type="collateral"
          executingLabel="Adding collateral"
          toExecuteLabel="Add collateral"
          info="Will add more collateral (Ether) and increase the ratio"
          name="addCollateralAmount"
          id="manager-add-collateral-input"
          symbol="ETH"
          errorText={getManageActionErrorText(addingCollateral, !addCollateralAmount, addCollateralAmount <= 0)}
          executeAction={() => { addCollateralAction(addCollateralAmount); }}
          noMax
        />

        <CdpAction
          disabled={boosting || !boostAmount || (boostAmount <= 0) || (boostAmount > maxDaiBoost)}
          actionExecuting={payingBackDai}
          setValToMax={() => {
            setAfterValue(maxDaiBoost, 'boost');
            dispatch(change('managerPaybackForm', 'paybackAmount', ''));
            dispatch(change('managerPaybackForm', 'addCollateralAmount', ''));
            dispatch(change('managerPaybackForm', 'boostAmount', maxDaiBoost));
          }}
          maxVal={maxDaiBoost}
          gettingMaxVal={gettingMaxDaiBoost}
          type="boost"
          executingLabel="Boosting"
          toExecuteLabel="Boost"
          info="Boost will draw DAI and buy ETH, increasing the amount ETH in the CDP"
          name="boostAmount"
          id="manager-boost-input"
          symbol="DAI"
          errorText={getManageActionErrorText(boosting, !boostAmount, boostAmount <= 0, boostAmount > maxDaiBoost)} // eslint-disable-line
          executeAction={() => { openBoostModal(parseFloat(boostAmount)); }}
        />
      </form>
    );
  }
}

ManagerPaybackForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAfterValue: PropTypes.func.isRequired,

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

  cdp: state.general.cdp,
});

const mapDispatchToProps = {
  addCollateralAction, openPaybackModal, setAfterValue, openBoostModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPaybackFormComp);

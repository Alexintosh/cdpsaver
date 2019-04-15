import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  change, formValueSelector, reduxForm,
} from 'redux-form';
import { addCollateralAction, setAfterValue, getPaybackFormMaxValues } from '../../../actions/dashboardActions';
import { openPaybackModal, openRepayModal } from '../../../actions/modalActions';
import { getManageActionErrorText } from '../../../utils/utils';
import CdpAction from '../CdpAction/CdpAction';

class ManagerPaybackForm extends Component {
  componentWillMount() {
    this.props.getPaybackFormMaxValues();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.cdp.id !== this.props.cdp.id) this.props.getPaybackFormMaxValues();
  }

  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      formValues, addingCollateral, addCollateralAction, setAfterValue,
      openPaybackModal, payingBackDai, dispatch, repayingDai, openRepayModal, maxEthRepay, gettingMaxEthRepay, cdp,
    } = this.props;

    const { paybackAmount, addCollateralAmount, repayDaiAmount } = formValues;
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
            dispatch(change('managerPaybackForm', 'repayDaiAmount', ''));
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
          disabled={repayingDai || !repayDaiAmount || (repayDaiAmount <= 0) || (repayDaiAmount > maxEthRepay)}
          actionExecuting={repayingDai}
          setValToMax={() => {
            setAfterValue(maxEthRepay, 'repay');
            dispatch(change('managerPaybackForm', 'paybackAmount', ''));
            dispatch(change('managerPaybackForm', 'addCollateralAmount', ''));
            dispatch(change('managerPaybackForm', 'repayDaiAmount', maxEthRepay));
          }}
          maxVal={maxEthRepay}
          gettingMaxVal={gettingMaxEthRepay}
          type="repay"
          executingLabel="Repaying"
          toExecuteLabel="Repay"
          info="Repay will draw ETH from CDP and payback the debt, lowering the liquidation price"
          name="repayDaiAmount"
          id="manager-repay-input"
          symbol="ETH"
          errorText={getManageActionErrorText(repayingDai, !repayDaiAmount, repayDaiAmount <= 0, repayDaiAmount > maxEthRepay)}  // eslint-disable-line
          executeAction={() => { openRepayModal(parseFloat(repayDaiAmount)); }}
        />
      </form>
    );
  }
}

ManagerPaybackForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAfterValue: PropTypes.func.isRequired,
  getPaybackFormMaxValues: PropTypes.func.isRequired,

  addCollateralAction: PropTypes.func.isRequired,
  addingCollateral: PropTypes.bool.isRequired,

  openPaybackModal: PropTypes.func.isRequired,
  payingBackDai: PropTypes.bool.isRequired,

  repayingDai: PropTypes.bool.isRequired,
  maxEthRepay: PropTypes.number.isRequired,
  gettingMaxEthRepay: PropTypes.bool.isRequired,
  openRepayModal: PropTypes.func.isRequired,

  cdp: PropTypes.object.isRequired,
};

const ManagerPaybackFormComp = reduxForm({ form: 'managerPaybackForm' })(ManagerPaybackForm);

const selector = formValueSelector('managerPaybackForm');

const mapStateToProps = state => ({
  formValues: {
    paybackAmount: selector(state, 'paybackAmount'),
    addCollateralAmount: selector(state, 'addCollateralAmount'),
    repayDaiAmount: selector(state, 'repayDaiAmount'),
  },
  addingCollateral: state.dashboard.addingCollateral,
  payingBackDai: state.dashboard.payingBackDai,

  repayingDai: state.dashboard.repayingDai,
  maxEthRepay: state.dashboard.maxEthRepay,
  gettingMaxEthRepay: state.dashboard.gettingMaxEthRepay,

  cdp: state.general.cdp,
});

const mapDispatchToProps = {
  addCollateralAction, openPaybackModal, setAfterValue, openRepayModal, getPaybackFormMaxValues,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPaybackFormComp);

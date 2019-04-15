import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  reduxForm, formValueSelector, change, getFormMeta,
} from 'redux-form';
import {
  generateDaiAction,
  withdrawEthAction,
  repayDaiAction,
  setAfterValue,
  getBorrowFormMaxValues,
} from '../../../actions/dashboardActions';
import { openBoostModal } from '../../../actions/modalActions';
import { getManageActionErrorText } from '../../../utils/utils';
import CdpAction from '../CdpAction/CdpAction';

class ManagerBorrowForm extends Component {
  componentWillMount() {
    this.props.getBorrowFormMaxValues();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.cdp.id !== this.props.cdp.id) this.props.getBorrowFormMaxValues();
  }

  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      generatingDai, generateDaiAction, formValues, maxDai, gettingMaxDai, dispatch,
      withdrawingEth, withdrawEthAction, maxEthWithdraw, gettingMaxEthWithdraw,
      setAfterValue, boosting, maxDaiBoost, gettingMaxDaiBoost, openBoostModal,
    } = this.props;

    const { generateDaiAmount, withdrawEthAmount, boostAmount } = formValues;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <CdpAction
          disabled={generatingDai || !generateDaiAmount || (generateDaiAmount <= 0) || (generateDaiAmount > maxDai)}
          actionExecuting={generatingDai}
          setValToMax={() => {
            setAfterValue(maxDai, 'generate');
            dispatch(change('managerBorrowForm', 'generateDaiAmount', maxDai));
            dispatch(change('managerBorrowForm', 'withdrawEthAmount', ''));
            dispatch(change('managerBorrowForm', 'boostAmount', ''));
          }}
          maxVal={maxDai}
          gettingMaxVal={gettingMaxDai}
          type="generate"
          executingLabel="Generating"
          toExecuteLabel="Generate"
          info="Generate will draw more Dai from the CDP"
          name="generateDaiAmount"
          id="manager-generate-input"
          symbol="DAI"
          errorText={getManageActionErrorText(generatingDai, !generateDaiAmount, generateDaiAmount <= 0, generateDaiAmount > maxDai)} // eslint-disable-line
          executeAction={() => { generateDaiAction(generateDaiAmount); }}
        />

        <CdpAction
          disabled={
            withdrawingEth || !withdrawEthAmount || (withdrawEthAmount <= 0) || (withdrawEthAmount > maxEthWithdraw)
          }
          actionExecuting={withdrawingEth}
          setValToMax={() => {
            setAfterValue(maxEthWithdraw, 'withdraw');
            dispatch(change('managerBorrowForm', 'withdrawEthAmount', maxEthWithdraw));
            dispatch(change('managerBorrowForm', 'generateDaiAmount', ''));
            dispatch(change('managerBorrowForm', 'boostAmount', ''));
          }}
          maxVal={maxEthWithdraw}
          gettingMaxVal={gettingMaxEthWithdraw}
          type="withdraw"
          executingLabel="Withdrawing"
          toExecuteLabel="Withdraw"
          info="Withdraw will take collateral (Ether) from the CDP"
          name="withdrawEthAmount"
          id="manager-withdraw-input"
          symbol="ETH"
          errorText={getManageActionErrorText(withdrawingEth, !withdrawEthAmount, withdrawEthAmount <= 0, withdrawEthAmount > maxEthWithdraw)}  // eslint-disable-line
          executeAction={() => { withdrawEthAction(withdrawEthAmount); }}
        />

        <CdpAction
          disabled={boosting || !boostAmount || (boostAmount <= 0) || (boostAmount > maxDaiBoost)}
          actionExecuting={boosting}
          setValToMax={() => {
            setAfterValue(maxDaiBoost, 'boost');
            dispatch(change('managerBorrowForm', 'withdrawEthAmount', ''));
            dispatch(change('managerBorrowForm', 'generateDaiAmount', ''));
            dispatch(change('managerBorrowForm', 'boostAmount', maxDaiBoost));
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

ManagerBorrowForm.propTypes = {
  cdp: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAfterValue: PropTypes.func.isRequired,
  getBorrowFormMaxValues: PropTypes.func.isRequired,

  generateDaiAction: PropTypes.func.isRequired,
  generatingDai: PropTypes.bool.isRequired,
  maxDai: PropTypes.number.isRequired,
  gettingMaxDai: PropTypes.bool.isRequired,

  withdrawEthAction: PropTypes.func.isRequired,
  withdrawingEth: PropTypes.bool.isRequired,
  maxEthWithdraw: PropTypes.number.isRequired,
  gettingMaxEthWithdraw: PropTypes.bool.isRequired,

  openBoostModal: PropTypes.func.isRequired,
  maxDaiBoost: PropTypes.number.isRequired,
  gettingMaxDaiBoost: PropTypes.bool.isRequired,
  boosting: PropTypes.bool.isRequired,
};

const ManagerBorrowFormComp = reduxForm({ form: 'managerBorrowForm' })(ManagerBorrowForm);

const selector = formValueSelector('managerBorrowForm');

const mapStateToProps = state => ({
  cdp: state.general.cdp,
  formMeta: getFormMeta('managerBorrowForm')(state),
  formValues: {
    generateDaiAmount: selector(state, 'generateDaiAmount'),
    withdrawEthAmount: selector(state, 'withdrawEthAmount'),
    boostAmount: selector(state, 'boostAmount'),
  },
  generatingDai: state.dashboard.generatingDai,
  maxDai: state.dashboard.maxDai,
  gettingMaxDai: state.dashboard.gettingMaxDai,

  withdrawingEth: state.dashboard.withdrawingEth,
  maxEthWithdraw: state.dashboard.maxEthWithdraw,
  gettingMaxEthWithdraw: state.dashboard.gettingMaxEthWithdraw,

  maxDaiBoost: state.dashboard.maxDaiBoost,
  gettingMaxDaiBoost: state.dashboard.gettingMaxDaiBoost,
  boosting: state.dashboard.boosting,
});

const mapDispatchToProps = {
  generateDaiAction, withdrawEthAction, repayDaiAction, setAfterValue, openBoostModal, getBorrowFormMaxValues,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBorrowFormComp);

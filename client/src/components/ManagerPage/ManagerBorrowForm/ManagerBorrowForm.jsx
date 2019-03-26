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
} from '../../../actions/dashboardActions';
import { openRepayModal } from '../../../actions/modalActions';
import { getManageActionErrorText } from '../../../utils/utils';
import CdpAction from '../CdpAction/CdpAction';

class ManagerBorrowForm extends Component {
  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      generatingDai, generateDaiAction, formValues, maxDai, gettingMaxDai, dispatch,
      withdrawingEth, withdrawEthAction, maxEthWithdraw, gettingMaxEthWithdraw,
      setAfterValue, repayingDai, openRepayModal, maxEthRepay, gettingMaxEthRepay,
    } = this.props;

    const { generateDaiAmount, withdrawEthAmount, repayDaiAmount } = formValues;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <CdpAction
          disabled={generatingDai || !generateDaiAmount || (generateDaiAmount <= 0) || (generateDaiAmount > maxDai)}
          actionExecuting={generatingDai}
          setValToMax={() => {
            setAfterValue(maxDai, 'generate');
            dispatch(change('managerBorrowForm', 'generateDaiAmount', maxDai));
            dispatch(change('managerBorrowForm', 'withdrawEthAmount', ''));
            dispatch(change('managerBorrowForm', 'repayDaiAmount', ''));
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
            dispatch(change('managerBorrowForm', 'repayDaiAmount', ''));
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
          disabled={repayingDai || !repayDaiAmount || (repayDaiAmount <= 0) || (repayDaiAmount > maxEthRepay)}
          actionExecuting={repayingDai}
          setValToMax={() => {
            setAfterValue(maxEthRepay, 'repay');
            dispatch(change('managerBorrowForm', 'withdrawEthAmount', ''));
            dispatch(change('managerBorrowForm', 'generateDaiAmount', ''));
            dispatch(change('managerBorrowForm', 'repayDaiAmount', maxEthRepay));
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

ManagerBorrowForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAfterValue: PropTypes.func.isRequired,

  generateDaiAction: PropTypes.func.isRequired,
  generatingDai: PropTypes.bool.isRequired,
  maxDai: PropTypes.number.isRequired,
  gettingMaxDai: PropTypes.bool.isRequired,

  withdrawEthAction: PropTypes.func.isRequired,
  withdrawingEth: PropTypes.bool.isRequired,
  maxEthWithdraw: PropTypes.number.isRequired,
  gettingMaxEthWithdraw: PropTypes.bool.isRequired,

  repayingDai: PropTypes.bool.isRequired,
  maxEthRepay: PropTypes.number.isRequired,
  gettingMaxEthRepay: PropTypes.bool.isRequired,
  openRepayModal: PropTypes.func.isRequired,
};

const ManagerBorrowFormComp = reduxForm({ form: 'managerBorrowForm' })(ManagerBorrowForm);

const selector = formValueSelector('managerBorrowForm');

const mapStateToProps = state => ({
  formMeta: getFormMeta('managerBorrowForm')(state),
  formValues: {
    generateDaiAmount: selector(state, 'generateDaiAmount'),
    withdrawEthAmount: selector(state, 'withdrawEthAmount'),
    repayDaiAmount: selector(state, 'repayDaiAmount'),
  },
  generatingDai: state.dashboard.generatingDai,
  maxDai: state.dashboard.maxDai,
  gettingMaxDai: state.dashboard.gettingMaxDai,

  withdrawingEth: state.dashboard.withdrawingEth,
  maxEthWithdraw: state.dashboard.maxEthWithdraw,
  gettingMaxEthWithdraw: state.dashboard.gettingMaxEthWithdraw,

  repayingDai: state.dashboard.repayingDai,
  maxEthRepay: state.dashboard.maxEthRepay,
  gettingMaxEthRepay: state.dashboard.gettingMaxEthRepay,
});

const mapDispatchToProps = {
  generateDaiAction, withdrawEthAction, repayDaiAction, setAfterValue, openRepayModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBorrowFormComp);

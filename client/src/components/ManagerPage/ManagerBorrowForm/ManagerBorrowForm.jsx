import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field, reduxForm, formValueSelector, change,
} from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import {
  generateDaiAction,
  withdrawEthAction,
  repayDaiAction,
  setAfterValue,
} from '../../../actions/dashboardActions';
import { formatNumber } from '../../../utils/utils';

class ManagerBorrowForm extends Component {
  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      generatingDai, generateDaiAction, formValues, maxDai, gettingMaxDai, dispatch,
      withdrawingEth, withdrawEthAction, maxEthWithdraw, gettingMaxEthWithdraw,
      setAfterValue, afterType, repayingDai, maxDaiRepay, repayDaiAction,
      gettingMaxDaiRepay,
    } = this.props;

    const { generateDaiAmount, withdrawEthAmount, repayDaiAmount } = formValues;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <div className="item">
          <div
            className={`max-wrapper ${generatingDai ? 'loading' : ''}`}
            onClick={() => {
              if (!generatingDai) {
                setAfterValue(maxDai, 'generate');
                dispatch(change('managerBorrowForm', 'generateDaiAmount', maxDai));
                dispatch(change('managerBorrowForm', 'withdrawEthAmount', ''));
                dispatch(change('managerBorrowForm', 'repayDaiAmount', ''));
              }
            }}
          >
            <TooltipWrapper title={maxDai}>
              { gettingMaxDai ? 'Loading...' : `(max ${formatNumber(maxDai, 2)})` }
            </TooltipWrapper>
          </div>
          <Field
            id="manager-generate-input"
            type="number"
            wrapperClassName={`form-item-wrapper generate ${afterType === 'generate' ? 'active' : ''}`}
            name="generateDaiAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'generate'); }}
            labelText="Generate:"
            secondLabelText="DAI"
            placeholder="0"
            additional={{ max: maxDai, min: 0 }}
            disabled={generatingDai}
            component={InputComponent}
          />
          <button
            type="button"
            className="button gray uppercase"
            onClick={() => { generateDaiAction(generateDaiAmount); }}
            disabled={generatingDai || !generateDaiAmount || (generateDaiAmount < 0) || (generateDaiAmount > maxDai)}
          >
            { generatingDai ? 'Generating' : 'Generate' }
          </button>
        </div>

        <div className="item">
          <div
            className={`max-wrapper ${withdrawingEth ? 'loading' : ''}`}
            onClick={() => {
              if (!withdrawingEth) {
                setAfterValue(maxEthWithdraw, 'withdraw');
                dispatch(change('managerBorrowForm', 'withdrawEthAmount', maxEthWithdraw));
                dispatch(change('managerBorrowForm', 'generateDaiAmount', ''));
                dispatch(change('managerBorrowForm', 'repayDaiAmount', ''));
              }
            }}
          >
            <TooltipWrapper title={maxEthWithdraw}>
              { gettingMaxEthWithdraw ? 'Loading...' : `(max ${formatNumber(maxEthWithdraw, 2)})` }
            </TooltipWrapper>
          </div>
          <Field
            id="manager-withdraw-input"
            type="number"
            wrapperClassName={`form-item-wrapper withdraw ${afterType === 'withdraw' ? 'active' : ''}`}
            name="withdrawEthAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'withdraw'); }}
            labelText="Withdraw:"
            secondLabelText="ETH"
            placeholder="0"
            additional={{ max: maxEthWithdraw, min: 0 }}
            disabled={withdrawingEth}
            component={InputComponent}
          />
          <button
            type="button"
            className="button gray uppercase"
            onClick={() => { withdrawEthAction(withdrawEthAmount); }}
            disabled={
              withdrawingEth || !withdrawEthAmount || (withdrawEthAmount < 0) || (withdrawEthAmount > maxEthWithdraw)
            }
          >
            { withdrawingEth ? 'Withdrawing' : 'Withdraw' }
          </button>
        </div>

        <div className="item">
          <div className="max-wrapper">(max 280)</div>
          <Field
            id="manager-repay-input"
            type="number"
            wrapperClassName={`form-item-wrapper repay ${afterType === 'repay' ? 'active' : ''}`}
            name="repayDaiAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'repay'); }}
            labelText="Repay:"
            secondLabelText="DAI"
            additional={{ min: 0 }}
            placeholder="0"
            disabled={repayingDai}
            component={InputComponent}
          />
          <button
            type="button"
            className="button gray uppercase"
            onClick={() => { repayDaiAction(repayDaiAmount); }}
            disabled={
              repayingDai || !repayDaiAmount || (repayDaiAmount < 0) || (repayDaiAmount > maxDaiRepay)
            }
          >
            Repay
          </button>
        </div>
      </form>
    );
  }
}

ManagerBorrowForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  setAfterValue: PropTypes.func.isRequired,
  afterType: PropTypes.string.isRequired,

  generateDaiAction: PropTypes.func.isRequired,
  generatingDai: PropTypes.bool.isRequired,
  maxDai: PropTypes.number.isRequired,
  gettingMaxDai: PropTypes.bool.isRequired,

  withdrawEthAction: PropTypes.func.isRequired,
  withdrawingEth: PropTypes.bool.isRequired,
  maxEthWithdraw: PropTypes.number.isRequired,
  gettingMaxEthWithdraw: PropTypes.bool.isRequired,

  repayDaiAction: PropTypes.func.isRequired,
  repayingDai: PropTypes.bool.isRequired,
  maxDaiRepay: PropTypes.number.isRequired,
  gettingMaxDaiRepay: PropTypes.bool.isRequired,
};

const ManagerBorrowFormComp = reduxForm({ form: 'managerBorrowForm' })(ManagerBorrowForm);

const selector = formValueSelector('managerBorrowForm');

const mapStateToProps = state => ({
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
  maxDaiRepay: state.dashboard.maxDaiRepay,
  gettingMaxDaiRepay: state.dashboard.gettingMaxDaiRepay,

  afterType: state.dashboard.afterType,
});

const mapDispatchToProps = {
  generateDaiAction, withdrawEthAction, repayDaiAction, setAfterValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBorrowFormComp);

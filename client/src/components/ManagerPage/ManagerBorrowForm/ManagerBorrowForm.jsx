import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field, reduxForm, formValueSelector, change,
} from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import {
  generateDaiAction,
  withdrawEthAction,
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
      setAfterValue,
    } = this.props;

    const { generateDaiAmount, withdrawEthAmount } = formValues;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <div className="item">
          <div
            className={`max-wrapper ${generatingDai ? 'loading' : ''}`}
            onClick={() => {
              if (!generatingDai) dispatch(change('managerBorrowForm', 'generateDaiAmount', maxDai));
            }}
          >
            { gettingMaxDai ? 'Loading...' : `(max ${formatNumber(maxDai, 2)})` }
          </div>
          <Field
            id="manager-generate-input"
            type="number"
            wrapperClassName="form-item-wrapper generate"
            name="generateDaiAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'generate'); }}
            labelText="Generate:"
            secondLabelText="DAI"
            placeholder="1"
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
              if (!withdrawingEth) dispatch(change('managerBorrowForm', 'withdrawEthAmount', maxDai));
            }}
          >
            { gettingMaxEthWithdraw ? 'Loading...' : `(max ${formatNumber(maxEthWithdraw, 2)})` }
          </div>
          <Field
            id="manager-withdraw-input"
            type="number"
            wrapperClassName="form-item-wrapper withdraw"
            name="withdrawEthAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'withdraw'); }}
            labelText="Withdraw:"
            secondLabelText="ETH"
            placeholder="1"
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
            wrapperClassName="form-item-wrapper repay"
            name="repayAmount"
            labelText="Repay:"
            secondLabelText="DAI"
            placeholder="1"
            component={InputComponent}
          />
          <button type="button" className="button gray uppercase">
            Repay
          </button>
        </div>
      </form>
    );
  }
}

ManagerBorrowForm.propTypes = {
  generateDaiAction: PropTypes.func.isRequired,
  generatingDai: PropTypes.bool.isRequired,
  formValues: PropTypes.object.isRequired,
  maxDai: PropTypes.number.isRequired,
  gettingMaxDai: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  withdrawEthAction: PropTypes.func.isRequired,
  withdrawingEth: PropTypes.bool.isRequired,
  maxEthWithdraw: PropTypes.number.isRequired,
  gettingMaxEthWithdraw: PropTypes.bool.isRequired,
  setAfterValue: PropTypes.func.isRequired,
};

const ManagerBorrowFormComp = reduxForm({ form: 'managerBorrowForm' })(ManagerBorrowForm);

const selector = formValueSelector('managerBorrowForm');

const mapStateToProps = state => ({
  formValues: {
    generateDaiAmount: selector(state, 'generateDaiAmount'),
    withdrawEthAmount: selector(state, 'withdrawEthAmount'),
  },
  generatingDai: state.dashboard.generatingDai,
  maxDai: state.dashboard.maxDai,
  gettingMaxDai: state.dashboard.gettingMaxDai,

  withdrawingEth: state.dashboard.withdrawingEth,
  maxEthWithdraw: state.dashboard.maxEthWithdraw,
  gettingMaxEthWithdraw: state.dashboard.gettingMaxEthWithdraw,
});

const mapDispatchToProps = {
  generateDaiAction, withdrawEthAction, setAfterValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBorrowFormComp);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field, reduxForm, formValueSelector, change, getFormMeta,
} from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import {
  generateDaiAction,
  withdrawEthAction,
  repayDaiAction,
  setAfterValue,
} from '../../../actions/dashboardActions';
import { openRepayModal } from '../../../actions/modalActions';
import { formatNumber, notGraterThan } from '../../../utils/utils';
import InfoBox from '../../Decorative/InfoBox/InfoBox';
import CdpAction from '../CdpAction/CdpAction';

/**
 * Switches between reasons why a button is disabled
 *
 * @param executingAction {Boolean}
 * @param noValue {Boolean}
 * @param valueUnderZero {Boolean}
 * @param overMax {Boolean}
 *
 * @return {String}
 */
const getErrorText = (executingAction, noValue, valueUnderZero, overMax = false) => {
  let err = '';

  if (overMax) err = 'Value is larger than the max value';
  if (valueUnderZero) err = 'Value can&#39;t be less than 0';
  if (noValue) err = 'No value entered';
  if (executingAction) err = 'Executing action';

  return err;
};

class ManagerBorrowForm extends Component {
  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      generatingDai, generateDaiAction, formValues, maxDai, gettingMaxDai, dispatch,
      withdrawingEth, withdrawEthAction, maxEthWithdraw, gettingMaxEthWithdraw,
      setAfterValue, afterType, repayingDai, openRepayModal, maxEthRepay, gettingMaxEthRepay,
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
          errorText={
            getErrorText(generatingDai, !generateDaiAmount, generateDaiAmount <= 0, generateDaiAmount > maxDai)
          }
          executeAction={() => { generateDaiAction(generateDaiAmount); }}
        />

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
            onChange={(e) => {
              if (e.target.value <= maxEthWithdraw) setAfterValue(e.target.value, 'withdraw');
            }}
            labelText="Withdraw:"
            secondLabelText="ETH"
            placeholder="0"
            normalize={val => notGraterThan(val, maxEthWithdraw)}
            additional={{ max: maxEthWithdraw, min: 0 }}
            disabled={withdrawingEth}
            component={InputComponent}
          />
          <div className="item-button-wrapper">
            <InfoBox message="Withdraw will take collateral (Ether) from the CDP" />
            <button
              type="button"
              className="button gray uppercase"
              onClick={() => { withdrawEthAction(withdrawEthAmount); }}
              disabled={
                withdrawingEth || !withdrawEthAmount || (withdrawEthAmount <= 0) || (withdrawEthAmount > maxEthWithdraw)
              }
            >
              { withdrawingEth ? 'Withdrawing' : 'Withdraw' }
            </button>
          </div>
        </div>

        <div className="item">
          <div
            className={`max-wrapper ${repayingDai ? 'loading' : ''}`}
            onClick={() => {
              if (!repayingDai) {
                setAfterValue(maxEthRepay, 'repay');
                dispatch(change('managerBorrowForm', 'withdrawEthAmount', ''));
                dispatch(change('managerBorrowForm', 'generateDaiAmount', ''));
                dispatch(change('managerBorrowForm', 'repayDaiAmount', maxEthRepay));
              }
            }}
          >
            <TooltipWrapper title={maxEthRepay}>
              { gettingMaxEthRepay ? 'Loading...' : `(max ${formatNumber(maxEthRepay, 2)})` }
            </TooltipWrapper>
          </div>

          <Field
            id="manager-repay-input"
            type="number"
            wrapperClassName={`form-item-wrapper repay ${afterType === 'repay' ? 'active' : ''}`}
            name="repayDaiAmount"
            onChange={(e) => {
              if (e.target.value <= maxEthRepay) setAfterValue(e.target.value, 'repay');
            }}
            labelText="Repay:"
            secondLabelText="ETH"
            normalize={val => notGraterThan(val, maxEthRepay)}
            additional={{ min: 0, max: maxEthRepay }}
            placeholder="0"
            disabled={repayingDai}
            component={InputComponent}
          />
          <div className="item-button-wrapper">
            <InfoBox message="Repay will draw ETH from CDP and payback the debt, lowering the liquidation price" />

            <button
              type="button"
              className="button gray uppercase"
              onClick={() => { openRepayModal(parseFloat(repayDaiAmount)); }}
              disabled={
                repayingDai || !repayDaiAmount || (repayDaiAmount <= 0) || (repayDaiAmount > maxEthRepay)
              }
            >
              Repay
            </button>
          </div>
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

  afterType: state.dashboard.afterType,
});

const mapDispatchToProps = {
  generateDaiAction, withdrawEthAction, repayDaiAction, setAfterValue, openRepayModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBorrowFormComp);

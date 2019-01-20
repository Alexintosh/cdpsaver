import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field, reduxForm, formValueSelector, change,
} from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import {
  generateDaiAction,
  withdrawEthAction,
} from '../../../actions/dashboardActions';

const ManagerBorrowForm = ({
  generatingDai, generateDaiAction, formValues, maxDai, gettingMaxDai, dispatch,
  withdrawingEth, withdrawEthAction,
}) => (
  <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
    <div className="item">
      <div
        className={`max-wrapper ${generatingDai ? 'loading' : ''}`}
        onClick={() => {
          if (!generatingDai) dispatch(change('managerBorrowForm', 'generateDaiAmount', maxDai));
        }}
      >
        { gettingMaxDai ? 'Loading...' : `(max ${maxDai.toFixed(2)})` }
      </div>
      <Field
        id="manager-generate-input"
        wrapperClassName="form-item-wrapper generate"
        name="generateDaiAmount"
        labelText="Generate:"
        secondLabelText="DAI"
        placeholder="1"
        component={InputComponent}
      />
      <button
        type="button"
        className="button gray uppercase"
        onClick={() => { generateDaiAction(formValues.generateDaiAmount); }}
        disabled={generatingDai || !formValues.generateDaiAmount}
      >
        { generatingDai ? 'Generating' : 'Generate' }
      </button>
    </div>

    <div className="item">
      <div className="max-wrapper">(max 280)</div>
      <Field
        id="manager-withdraw-input"
        wrapperClassName="form-item-wrapper withdraw"
        name="withdrawEthAmount"
        labelText="Withdraw:"
        secondLabelText="ETH"
        placeholder="1"
        component={InputComponent}
      />
      <button
        type="button"
        className="button gray uppercase"
        onClick={() => { withdrawEthAction(formValues.withdrawEthAmount); }}
        disabled={withdrawingEth || !formValues.withdrawEthAmount}
      >
        { withdrawingEth ? 'Withdrawing' : 'Withdraw' }
      </button>
    </div>

    <div className="item">
      <div className="max-wrapper">(max 280)</div>
      <Field
        id="manager-repay-input"
        wrapperClassName="form-item-wrapper repay"
        name="repay"
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

ManagerBorrowForm.propTypes = {
  generateDaiAction: PropTypes.func.isRequired,
  generatingDai: PropTypes.bool.isRequired,
  formValues: PropTypes.object.isRequired,
  maxDai: PropTypes.number.isRequired,
  gettingMaxDai: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  withdrawEthAction: PropTypes.func.isRequired,
  withdrawingEth: PropTypes.bool.isRequired,
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
});

const mapDispatchToProps = {
  generateDaiAction, withdrawEthAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBorrowFormComp);

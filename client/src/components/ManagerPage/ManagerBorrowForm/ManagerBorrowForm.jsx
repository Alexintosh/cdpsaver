import React from 'react';
// import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import InputComponent from '../../Forms/InputComponent';

const ManagerBorrowForm = () => (
  <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
    <div className="item">
      <Field
        id="manager-generate-input"
        wrapperClassName="form-item-wrapper generate"
        name="generate"
        labelText="Generate:"
        secondLabelText="DAI"
        placeholder="1"
        component={InputComponent}
      />
      <button type="button" className="button gray uppercase">
        Generate
      </button>
    </div>

    <div className="item">
      <Field
        id="manager-withdraw-input"
        wrapperClassName="form-item-wrapper withdraw"
        name="withdraw"
        labelText="Withdraw:"
        secondLabelText="DAI"
        placeholder="1"
        component={InputComponent}
      />
      <button type="button" className="button gray uppercase">
        Withdraw
      </button>
    </div>

    <div className="item">
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

const ManagerBorrowFormComp = reduxForm({ form: 'managerBorrowForm' })(ManagerBorrowForm);

export default ManagerBorrowFormComp;

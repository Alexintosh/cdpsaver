import React from 'react';
// import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import InputComponent from '../../Forms/InputComponent';

const ManagerPaybackForm = () => (
  <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
    <div className="item">
      <Field
        id="manager-payback-input"
        wrapperClassName="form-item-wrapper payback"
        name="payback"
        labelText="Payback:"
        secondLabelText="DAI"
        placeholder="1"
        component={InputComponent}
      />
      <button type="button" className="button gray uppercase">
        Payback
      </button>
    </div>

    <div className="item">
      <Field
        id="manager-add-collateral-input"
        wrapperClassName="form-item-wrapper collateral"
        name="addCollateral"
        labelText="Withdraw:"
        secondLabelText="DAI"
        placeholder="1"
        component={InputComponent}
      />
      <button type="button" className="button gray uppercase variable-width">
        Add Collateral
      </button>
    </div>

    <div className="item">
      <Field
        id="manager-boost-input"
        wrapperClassName="form-item-wrapper boost"
        name="boost"
        labelText="Boost:"
        secondLabelText="DAI"
        placeholder="1"
        component={InputComponent}
      />
      <button type="button" className="button gray uppercase">
        Boost
      </button>
    </div>
  </form>
);

const ManagerPaybackFormComp = reduxForm({ form: 'managerBorrowForm' })(ManagerPaybackForm);

export default ManagerPaybackFormComp;

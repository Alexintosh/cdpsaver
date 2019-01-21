import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import { addCollateralAction } from '../../../actions/dashboardActions';

const ManagerPaybackForm = ({
  formValues, addingCollateral, addCollateralAction,
}) => (
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
        name="addCollateralAmount"
        labelText="Add collateral:"
        secondLabelText="ETH"
        placeholder="1"
        component={InputComponent}
      />

      <button
        type="button"
        className="button gray uppercase variable-width"
        onClick={() => { addCollateralAction(formValues.addCollateralAmount); }}
        disabled={addingCollateral || !formValues.addCollateralAmount}
      >
        { addingCollateral ? 'Adding collateral' : 'Add collateral' }
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

ManagerPaybackForm.propTypes = {
  addCollateralAction: PropTypes.func.isRequired,
  addingCollateral: PropTypes.bool.isRequired,
  formValues: PropTypes.object.isRequired,
};

const ManagerPaybackFormComp = reduxForm({ form: 'managerPaybackForm' })(ManagerPaybackForm);

const selector = formValueSelector('managerPaybackForm');

const mapStateToProps = state => ({
  formValues: {
    addCollateralAmount: selector(state, 'addCollateralAmount'),
  },
  addingCollateral: state.dashboard.addingCollateral,
});


const mapDispatchToProps = {
  addCollateralAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPaybackFormComp);

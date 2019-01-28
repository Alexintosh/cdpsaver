import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import InputComponent from '../../Forms/InputComponent';
import { addCollateralAction, setAfterValue } from '../../../actions/dashboardActions';

class ManagerPaybackForm extends Component {
  componentWillUnmount() {
    this.props.setAfterValue(0, 'clear');
  }

  render() {
    const {
      formValues, addingCollateral, addCollateralAction, setAfterValue, afterType,
    } = this.props;

    const { paybackAmount, addCollateralAmount, boostAmount } = formValues;

    return (
      <form className="action-items-wrapper form-wrapper" onSubmit={() => {}}>
        <div className="item">
          <Field
            id="manager-payback-input"
            type="number"
            wrapperClassName="form-item-wrapper payback"
            name="paybackAmount"
            labelText="Payback:"
            secondLabelText="DAI"
            placeholder="0"
            additional={{ min: 0 }}
            component={InputComponent}
          />
          <button type="button" className="button gray uppercase" disabled={paybackAmount < 0}>
            Payback
          </button>
        </div>

        <div className="item">
          <Field
            id="manager-add-collateral-input"
            type="number"
            wrapperClassName={`form-item-wrapper collateral ${afterType === 'collateral' ? 'active' : ''}`}
            name="addCollateralAmount"
            onChange={(e) => { setAfterValue(e.target.value, 'collateral'); }}
            labelText="Add collateral:"
            secondLabelText="ETH"
            placeholder="0"
            additional={{ min: 0 }}
            disabled={addingCollateral}
            component={InputComponent}
          />

          <button
            type="button"
            className="button gray uppercase variable-width"
            onClick={() => { addCollateralAction(addCollateralAmount); }}
            disabled={addingCollateral || !addCollateralAmount || addCollateralAmount < 0}
          >
            { addingCollateral ? 'Adding collateral' : 'Add collateral' }
          </button>
        </div>

        <div className="item">
          <Field
            id="manager-boost-input"
            type="number"
            wrapperClassName="form-item-wrapper boost"
            name="boostAmount"
            labelText="Boost:"
            secondLabelText="DAI"
            placeholder="0"
            additional={{ min: 0 }}
            component={InputComponent}
          />
          <button type="button" className="button gray uppercase" disabled={boostAmount < 0}>
            Boost
          </button>
        </div>
      </form>
    );
  }
}

ManagerPaybackForm.propTypes = {
  addCollateralAction: PropTypes.func.isRequired,
  addingCollateral: PropTypes.bool.isRequired,
  formValues: PropTypes.object.isRequired,
  setAfterValue: PropTypes.func.isRequired,
  afterType: PropTypes.string.isRequired,
};

const ManagerPaybackFormComp = reduxForm({ form: 'managerPaybackForm' })(ManagerPaybackForm);

const selector = formValueSelector('managerPaybackForm');

const mapStateToProps = state => ({
  formValues: {
    paybackAmount: selector(state, 'paybackAmount'),
    addCollateralAmount: selector(state, 'addCollateralAmount'),
    boostAmount: selector(state, 'boostAmount'),
  },
  addingCollateral: state.dashboard.addingCollateral,

  afterType: state.dashboard.afterType,
});

const mapDispatchToProps = {
  addCollateralAction, setAfterValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPaybackFormComp);

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formValueSelector, reduxForm, Field } from 'redux-form';
import InputComponent from '../../../Forms/InputComponent';
import { setLedgerPath } from '../../../../actions/generalActions';

const CustomLedgerPathForm = ({ listingLedgerAccounts, setLedgerPath }) => (
  <form onSubmit={() => {}} className="form-wrapper custom-path-form">
    <Field
      focus
      id="connect-ledger-path"
      name="path"
      labelText="Path:"
      disabled={listingLedgerAccounts}
      component={InputComponent}
      onChange={({ target }) => { setLedgerPath(target.value); }}
      showErrorText
    />
  </form>
);

CustomLedgerPathForm.propTypes = {
  listingLedgerAccounts: PropTypes.bool.isRequired,
  setLedgerPath: PropTypes.func.isRequired,
};

const CustomLedgerPathFormComp = reduxForm({
  form: 'customLedgerPathForm',
})(CustomLedgerPathForm);

const selector = formValueSelector('customLedgerPathForm');

const mapStateToProps = state => ({
  listingLedgerAccounts: state.general.listingLedgerAccounts,
  initialValues: {
    path: state.general.path,
  },
  formValue: selector(state, 'path'),
});

const mapDispatchToProps = {
  setLedgerPath,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomLedgerPathFormComp);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import InputComponent from '../../../Forms/InputComponent';
import { transferCdpAction } from '../../../../actions/dashboardActions';

const TransferCdpForm = ({
  handleSubmit, onSubmit, history, closeModal,
}) => (
  <form
    id="transfer-cdp-form"
    onSubmit={handleSubmit((e) => { onSubmit(e, history, closeModal); })}
    className="form-wrapper"
  >
    <Field
      id="to-address"
      name="toAddress"
      labelText="New owner"
      placeholder="0x0000000000000000000000000000000000000000"
      component={InputComponent}
      showErrorText
      focus
    />
  </form>
);

TransferCdpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const TransferCdpFormComp = reduxForm({
  form: 'transferCdpForm',
})(TransferCdpForm);

const mapDispatchToProps = {
  onSubmit: transferCdpAction,
};

export default connect(null, mapDispatchToProps)(TransferCdpFormComp);

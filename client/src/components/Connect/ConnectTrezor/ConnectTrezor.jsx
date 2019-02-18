import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { normalLogin } from '../../../actions/accountActions';
import InputComponent from '../../Forms/InputComponent';

const ConnectTrezor = ({
  connectingProvider, history, to, formValue, handleSubmit, onSubmit, handleSwitch,
}) => (
  <div className="connect-login-wrapper trezor">
    <h2>This is a secure way to access your wallet</h2>
    <p>
      Connect your Trezor, unlock it and open the Ethereum app to start trading on Trustless.
    </p>

    <form onSubmit={handleSubmit(() => { onSubmit('trezor', history, to, formValue); })} className="form-wrapper">

      <Field
        id="connect-trezor-path"
        name="path"
        labelText="Path:"
        component={InputComponent}
        showErrorText
      />

      <div className="buttons-wrapper">
        <div className="button uppercase gray" onClick={() => { handleSwitch('choose'); }}>
          Cancel
        </div>

        <button
          disabled={connectingProvider || !formValue}
          type="submit"
          className="button uppercase green"
        >
          Connect Trezor
        </button>
      </div>
    </form>
  </div>
);

ConnectTrezor.defaultProps = {
  formValue: '',
};

ConnectTrezor.propTypes = {
  history: PropTypes.object.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  formValue: PropTypes.string,
};

const ConnectTrezorFormComp = reduxForm({
  form: 'connectTrezorForm',
})(ConnectTrezor);

const selector = formValueSelector('connectTrezorForm');

const mapStateToProps = state => ({
  connectingProvider: state.general.connectingProvider,
  initialValues: {
    path: "m/44'/60'/0'/0/0",
  },
  formValue: selector(state, 'path'),
});

const mapDispatchToProps = {
  onSubmit: normalLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectTrezorFormComp);

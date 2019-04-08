import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { LEDGER_ACC_TYPES } from '../../../constants/general';
import { changeLedgerAccType } from '../../../actions/generalActions';

import './ConnectLedger.scss';

class ConnectLedger extends Component {
  componentWillMount() {
    // get ledger acc list
  }

  render() {
    const { ledgerAccType, changeLedgerAccType, handleSwitch } = this.props;

    return (
      <div className="connect-login-wrapper ledger-wrapper">
        <h2>This is a secure way to access your wallet</h2>
        <p>
          Connect your Ledger wallet, unlock it connect it to start managing your CDPS.
        </p>

        <div className="acc-select-wrapper">
          <div className="label">Account type:</div>

          <Select
            className="select box"
            classNamePrefix="select"
            value={ledgerAccType}
            onChange={changeLedgerAccType}
            options={LEDGER_ACC_TYPES}
          />
        </div>

        <div className="buttons-wrapper">
          <div className="button uppercase gray" onClick={() => { handleSwitch('choose'); }}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

ConnectLedger.propTypes = {
  to: PropTypes.string.isRequired,
  ledgerAccType: PropTypes.string.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  changeLedgerAccType: PropTypes.func.isRequired,
};

const mapStateToProps = ({ general }) => ({
  ledgerAccType: general.ledgerAccType,
});

const mapDispatchToProps = {
  changeLedgerAccType,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectLedger);

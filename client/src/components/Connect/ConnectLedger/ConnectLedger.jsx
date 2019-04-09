import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Loader from '../../Loader/Loader';
import { LEDGER_ACC_TYPES } from '../../../constants/general';
import { changeLedgerAccType, listLedgerAccounts, setLedgerDefaultPath } from '../../../actions/generalActions';

import './ConnectLedger.scss';

class ConnectLedger extends Component {
  componentWillMount() {
    this.props.listLedgerAccounts();
    this.props.setLedgerDefaultPath();
  }

  componentWillUnmount() {
    // TODO - reset state values here
  }

  render() {
    const {
      ledgerAccType, changeLedgerAccType, handleSwitch, to, listingLedgerAccounts, listingLedgerAccountsError,
      ledgerAccounts,
    } = this.props;

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

        <div className="list-wrapper">
          {
            listingLedgerAccounts && (<div className="loading-wrapper"><Loader /></div>)
          }

          {
            !listingLedgerAccounts && listingLedgerAccountsError && (
              <div className="error-wrapper">{ listingLedgerAccountsError }</div>
            )
          }

          {
            !listingLedgerAccounts && !listingLedgerAccountsError && (
              <div className="list">
                {
                  ledgerAccounts.map(item => (
                    <div className="single-acc" key={item.path}>
                      { item.address }
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>

        <div className="buttons-wrapper">
          <div className="button uppercase gray cancel" onClick={() => { handleSwitch('choose'); }}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

ConnectLedger.propTypes = {
  to: PropTypes.string.isRequired,
  ledgerAccType: PropTypes.object.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  changeLedgerAccType: PropTypes.func.isRequired,
  listLedgerAccounts: PropTypes.func.isRequired,
  setLedgerDefaultPath: PropTypes.func.isRequired,
  listingLedgerAccounts: PropTypes.bool.isRequired,
  listingLedgerAccountsError: PropTypes.string.isRequired,
  ledgerAccounts: PropTypes.array.isRequired,
};

const mapStateToProps = ({ general }) => ({
  ledgerAccType: general.ledgerAccType,

  listingLedgerAccounts: general.listingLedgerAccounts,
  listingLedgerAccountsError: general.listingLedgerAccountsError,
  ledgerAccounts: general.ledgerAccounts,
});

const mapDispatchToProps = {
  changeLedgerAccType, listLedgerAccounts, setLedgerDefaultPath,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectLedger);

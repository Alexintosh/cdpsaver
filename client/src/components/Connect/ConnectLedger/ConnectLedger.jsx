import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Tooltip } from 'react-tippy';
import Loader from '../../Loader/Loader';
import CustomLedgerPathForm from './CustomLedgerPathForm/CustomLedgerPathForm';
import { LEDGER_ACC_TYPES } from '../../../constants/general';
import {
  changeLedgerAccType, listLedgerAccounts, setLedgerDefaultPath, ledgerListMoreAccounts, resetConnectLedger,
} from '../../../actions/generalActions';
import { normalLogin } from '../../../actions/accountActions';
import { compareAddresses } from '../../../utils/utils';

import './ConnectLedger.scss';

class ConnectLedger extends Component {
  componentWillMount() {
    this.props.setLedgerDefaultPath();
    this.props.listLedgerAccounts();
  }

  componentWillUnmount() {
    this.props.resetConnectLedger();
  }

  render() {
    const {
      ledgerAccType, changeLedgerAccType, handleSwitch, to, listingLedgerAccounts, listingLedgerAccountsError,
      ledgerListMoreAccounts, ledgerAccounts, listingMoreLedgerAccounts, history, connectingProvider, normalLogin,
      account,
    } = this.props;

    const noClick = listingLedgerAccounts || listingMoreLedgerAccounts || connectingProvider;

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
            isDisabled={noClick}
            options={LEDGER_ACC_TYPES}
          />
        </div>

        { ledgerAccType && ledgerAccType.value === 'custom' && (<CustomLedgerPathForm />) }

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
                <div className="accounts-wrapper">
                  {
                    ledgerAccounts.map((item) => {
                      const connectedAddress = compareAddresses(item.address, account);

                      if (connectedAddress) {
                        return (
                          <Tooltip title="This account is currently connected">
                            <div className="single-acc no-click" key={item.path}>{ item.address }</div>
                          </Tooltip>
                        );
                      }

                      return (
                        <div
                          className={`single-acc ${noClick ? 'no-click' : 'can-click'}`}
                          key={item.path}
                          onClick={() => {
                            if (noClick) return;

                            normalLogin('ledger', history, to, item.path);
                          }}
                        >
                          { item.address }
                        </div>
                      );
                    })
                  }
                </div>

                {
                  ledgerAccType && ledgerAccType.value !== 'custom' && (
                    <button
                      type="button"
                      className="more"
                      disabled={listingMoreLedgerAccounts}
                      onClick={ledgerListMoreAccounts}
                    >
                      { listingMoreLedgerAccounts ? 'Loading' : 'Load' } more accounts
                    </button>
                  )
                }
              </div>
            )
          }
        </div>

        <div className="buttons-wrapper">
          <div className="button uppercase gray" id="cancel" onClick={() => { handleSwitch('choose'); }}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

ConnectLedger.propTypes = {
  to: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  ledgerAccType: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  changeLedgerAccType: PropTypes.func.isRequired,
  listLedgerAccounts: PropTypes.func.isRequired,
  ledgerListMoreAccounts: PropTypes.func.isRequired,
  setLedgerDefaultPath: PropTypes.func.isRequired,
  resetConnectLedger: PropTypes.func.isRequired,
  normalLogin: PropTypes.func.isRequired,
  listingLedgerAccounts: PropTypes.bool.isRequired,
  listingLedgerAccountsError: PropTypes.string.isRequired,
  ledgerAccounts: PropTypes.array.isRequired,
  listingMoreLedgerAccounts: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ general }) => ({
  account: general.account,
  connectingProvider: general.connectingProvider,
  ledgerAccType: general.ledgerAccType,

  listingLedgerAccounts: general.listingLedgerAccounts,
  listingLedgerAccountsError: general.listingLedgerAccountsError,
  ledgerAccounts: general.ledgerAccounts,

  listingMoreLedgerAccounts: general.listingMoreLedgerAccounts,
});

const mapDispatchToProps = {
  changeLedgerAccType,
  listLedgerAccounts,
  setLedgerDefaultPath,
  ledgerListMoreAccounts,
  resetConnectLedger,
  normalLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectLedger);

import React from 'react';
import PropTypes from 'prop-types';

import './ConnectWalletButtons.scss';

const ConnectWalletButtons = ({ handleSwitch, accountType }) => (
  <div className="connect-wallet-buttons">
    <button
      disabled={accountType === 'metamask'}
      type="button"
      className="button green"
      onClick={() => { handleSwitch('metamask'); }}
    >
      Metamask
    </button>

    <button
      type="button"
      className="button green"
      onClick={() => { handleSwitch('trezor'); }}
    >
      Trezor
    </button>

    <button type="button" className="button green">Ledger</button>
  </div>
);

ConnectWalletButtons.propTypes = {
  handleSwitch: PropTypes.func.isRequired,
  accountType: PropTypes.string.isRequired,
};

export default ConnectWalletButtons;

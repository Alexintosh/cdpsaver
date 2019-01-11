import React from 'react';
import PropTypes from 'prop-types';

import './ConnectWalletButtons.scss';

const ConnectWalletButtons = ({ handleSwitch }) => (
  <div className="connect-wallet-buttons">
    <button type="button" className="button green" onClick={() => { handleSwitch('metamask'); }}>
      Metamask
    </button>

    <button type="button" className="button green">Trezor</button>

    <button type="button" className="button green">Ledger</button>
  </div>
);

ConnectWalletButtons.propTypes = {
  handleSwitch: PropTypes.func.isRequired,
};

export default ConnectWalletButtons;

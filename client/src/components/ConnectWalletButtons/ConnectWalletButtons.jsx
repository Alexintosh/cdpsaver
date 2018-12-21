import React from 'react';
import { connect } from 'react-redux';

import './ConnectWalletButtons.scss';

const ConnectWalletButtons = () => (
  <div className="connect-wallet-buttons">
    <button type="button" className="button green">Metamask</button>
    <button type="button" className="button green">Trezor</button>
    <button type="button" className="button green">Ledger</button>
  </div>
);

ConnectWalletButtons.propTypes = {};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(ConnectWalletButtons);

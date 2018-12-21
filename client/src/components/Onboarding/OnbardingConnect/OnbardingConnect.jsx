import React from 'react';
import { connect } from 'react-redux';
import ConnectWalletButtons from '../../ConnectWalletButtons/ConnectWalletButtons';

import './OnbardingConnect.scss';

const OnbardingConnect = () => (
  <div className="onboarding-connect-wrapper">
    <div className="connect-heading">Connect your wallet</div>
    <div className="connect-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    </div>

    <ConnectWalletButtons />
  </div>
);

OnbardingConnect.propTypes = {};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(OnbardingConnect);

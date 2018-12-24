import React from 'react';
import { connect } from 'react-redux';
import ConnectWalletButtons from '../../ConnectWalletButtons/ConnectWalletButtons';

import './OnbardingConnect.scss';

const OnbardingConnect = () => (
  <div className="onboarding-connect-wrapper onboarding-page-wrapper">
    <div className="sub-heading-wrapper">
      <div className="width-container">
        <div className="sub-title">Connect your wallet</div>
        <div className="sub-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </div>
      </div>
    </div>

    <div className="onboarding-content-bg">
      <div className="onboarding-content-wrapper width-container">

        <div className="connect-heading">Connect your wallet</div>
        <div className="connect-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </div>

        <ConnectWalletButtons />
      </div>
    </div>
  </div>
);

OnbardingConnect.propTypes = {};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(OnbardingConnect);

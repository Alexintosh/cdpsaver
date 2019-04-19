import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConnectWalletButtons from '../ConnectWalletButtons/ConnectWalletButtons';
import ConnectTrezor from './ConnectTrezor/ConnectTrezor';
import ConnectLedger from './ConnectLedger/ConnectLedger';
import ConnectMetaMask from './ConnectMetaMask/ConnectMetaMask';
import SwitchToDesktop from '../SwitchToDesktop/SwitchToDesktop';
import { normalLogin } from '../../actions/accountActions';
import { isMobileDevice } from '../../utils/utils';

import './Connect.scss';

class Connect extends Component {
  constructor(props) {
    super(props);

    this.state = { shown: 'choose' };

    this.switch = this.switch.bind(this);
  }

  switch(slug) { this.setState({ shown: slug }); }

  render() {
    if (isMobileDevice()) return (<SwitchToDesktop />);

    const { location, history, accountType } = this.props;
    const { shown } = this.state;
    const to = location.state ? location.state.to : '/dashboard/manage';

    return (
      <div className="connect-wrapper onboarding-page-wrapper">
        <div className="sub-heading-wrapper">
          <div className="width-container">
            <div className="sub-title">Connect your wallet</div>
            <div className="sub-text" />
          </div>
        </div>

        <div className="onboarding-content-bg">
          <div className="onboarding-content-wrapper width-container">

            <div className="connect-heading">Connect your wallet</div>
            <div className="content-text">
              Get started by connecting one of the wallets below
            </div>

            { shown === 'choose' && (<ConnectWalletButtons handleSwitch={this.switch} accountType={accountType} />) }

            { shown === 'trezor' && (<ConnectTrezor handleSwitch={this.switch} history={history} to={to} />) }
            { shown === 'ledger' && (<ConnectLedger handleSwitch={this.switch} history={history} to={to} />) }
            { shown === 'metamask' && (<ConnectMetaMask handleSwitch={this.switch} history={history} to={to} />) }
          </div>
        </div>
      </div>
    );
  }
}

Connect.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  accountType: PropTypes.string.isRequired,
};

const mapStateToProps = ({ general }) => ({
  connectingProvider: general.connectingProvider,
  accountType: general.accountType,
});

const mapDispatchToProps = {
  normalLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Connect));

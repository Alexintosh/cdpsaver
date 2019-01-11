import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConnectWalletButtons from '../../ConnectWalletButtons/ConnectWalletButtons';
import { loginMetaMask } from '../../../actions/accountActions';

import './OnbardingConnect.scss';

class OnbardingConnect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shown: 'choose',
    };

    this.switch = this.switch.bind(this);
  }

  switch(slug) {
    this.setState({
      shown: slug,
    }, () => {
      // if (slug === 'ledger') this.ledgerList();
    });
  }

  render() {
    const {
      loginMetaMask, connectingProvider, location, history,
    } = this.props;
    const to = location.state ? location.state.to : '/dashboard/saver';

    // TODO CHECK IF CONNECTED AND REDIRECT IF SO

    return (
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
            <div className="content-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            </div>

            {
              this.state.shown === 'choose' && (<ConnectWalletButtons handleSwitch={this.switch} />)
            }

            {
              this.state.shown === 'metamask' && (
                <div className="metamask-login-wrapper">
                  <h2>This is a recommended way to access your wallet</h2>
                  <p>
                    MetaMask is a browser extension that allows you to access your wallet
                    quickly, safely & easily. It is more secure because you never enter your
                    private key on a website. It protects you from phishing & malicious websites.
                  </p>

                  <button
                    disabled={connectingProvider}
                    type="button"
                    className="button uppercase green"
                    onClick={() => loginMetaMask(false, history, to)}
                  >
                    Connect Metamask
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

OnbardingConnect.propTypes = {
  history: PropTypes.object.isRequired,
  loginMetaMask: PropTypes.func.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = ({ general }) => ({
  connectingProvider: general.connectingProvider,
});

const mapDispatchToProps = {
  loginMetaMask,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OnbardingConnect));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConnectWalletButtons from '../ConnectWalletButtons/ConnectWalletButtons';
import { normalLogin } from '../../actions/accountActions';

import './Connect.scss';

class Connect extends Component {
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
      normalLogin, connectingProvider, location, history, accountType,
    } = this.props;
    const to = location.state ? location.state.to : '/dashboard/manage';

    return (
      <div className="connect-wrapper onboarding-page-wrapper">
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
              this.state.shown === 'choose' && (
                <ConnectWalletButtons handleSwitch={this.switch} accountType={accountType} />
              )
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

                  <div className="buttons-wrapper">
                    <div
                      className="button uppercase gray"
                      onClick={() => { this.switch('choose'); }}
                    >
                      Cancel
                    </div>

                    <button
                      disabled={connectingProvider || accountType === 'metamask'}
                      type="button"
                      className="button uppercase green"
                      onClick={() => normalLogin('metamask', history, to)}
                    >
                      Connect Metamask
                    </button>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

Connect.propTypes = {
  history: PropTypes.object.isRequired,
  normalLogin: PropTypes.func.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
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

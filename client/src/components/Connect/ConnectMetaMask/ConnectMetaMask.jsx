import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { normalLogin } from '../../../actions/accountActions';

const ConnectMetaMask = ({
  connectingProvider, accountType, history, to, normalLogin, handleSwitch,
}) => (
  <div className="connect-login-wrapper metamask">
    <h2>This is a recommended way to access your wallet</h2>
    <p>
      MetaMask is a browser extension that allows you to access your wallet
      quickly, safely & easily. It is more secure because you never enter your
      private key on a website. It protects you from phishing & malicious websites.
    </p>

    <div className="buttons-wrapper">
      <div
        className="button uppercase gray"
        onClick={() => { handleSwitch('choose'); }}
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
);

ConnectMetaMask.propTypes = {
  history: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
  normalLogin: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  accountType: PropTypes.string.isRequired,
};

const mapStateToProps = ({ general }) => ({
  connectingProvider: general.connectingProvider,
  accountType: general.accountType,
});

const mapDispatchToProps = {
  normalLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectMetaMask);

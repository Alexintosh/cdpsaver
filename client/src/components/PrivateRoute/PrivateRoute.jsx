import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Loader from '../Loader/Loader';

const PrivateRoute = ({
  component: Component, account, match, connectingProvider, cdp,
  gettingCdp, loggingIn, migratePage, ...rest
}) => {
  const showloggingIn = loggingIn && (!connectingProvider && !gettingCdp);
  const showLoader = connectingProvider || gettingCdp || showloggingIn;

  if (showLoader) {
    let message = '';

    if (loggingIn) message = 'Logging in, please wait...';
    if (connectingProvider) message = 'Connecting web3 provider, please wait...';
    if (gettingCdp) message = 'Getting your cdp, please wait...';

    return (
      <div className="loader-page-wrapper private">
        <Loader message={message} />
      </div>
    );
  }

  if (!loggingIn && !account) return (<Redirect to={{ pathname: '/connect', state: { to: rest.path } }} />);
  if (!loggingIn && !cdp) return (<Redirect to="/onboarding" />);
  if (!loggingIn && cdp && !migratePage && cdp.owner === account) return (<Redirect to="/migrate" />);

  return (
    <Route {...rest} render={props => (<Component {...props} />)} />
  );
};

PrivateRoute.defaultProps = {
  account: '',
  cdp: null,
  migratePage: false,
};

PrivateRoute.propTypes = {
  match: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  gettingCdp: PropTypes.bool.isRequired,
  loggingIn: PropTypes.bool.isRequired,
  migratePage: PropTypes.bool,
  account: PropTypes.string,
  cdp: PropTypes.object,
};

const mapStateToProps = ({ general }) => ({
  account: general.account,
  connectingProvider: general.connectingProvider,
  cdp: general.cdp,
  gettingCdp: general.gettingCdp,
  loggingIn: general.loggingIn,
});

export default connect(mapStateToProps)(withRouter(PrivateRoute));

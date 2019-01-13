import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = ({
  component: Component, account, match, connectingProvider, cdp,
  onboardingFinished, ...rest
}) => {
  if (connectingProvider) return (<div>Connecting provider, please wait.</div>);
  if (!account) return (<Redirect to={{ pathname: '/connect', state: { to: rest.path } }} />);
  if (!cdp || !onboardingFinished) return (<Redirect to="/onboarding" />);

  return (
    <Route {...rest} render={props => (<Component {...props} />)} />
  );
};

PrivateRoute.defaultProps = {
  account: '',
  cdp: null,
};

PrivateRoute.propTypes = {
  match: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  onboardingFinished: PropTypes.bool.isRequired,
  account: PropTypes.string,
  cdp: PropTypes.object,
};

const mapStateToProps = ({ general, onboarding }) => ({
  account: general.account,
  connectingProvider: general.connectingProvider,
  cdp: general.cdp,
  onboardingFinished: onboarding.onboardingFinished,
});

export default connect(mapStateToProps)(withRouter(PrivateRoute));

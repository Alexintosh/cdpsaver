import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = ({
  component: Component, account, match, connectingProvider, cdp, ...rest
}) => {
  if (connectingProvider) return (<div>Connecting provider, please wait.</div>);
  if (!account) return (<Redirect to={{ pathname: '/connect', state: { to: rest.path } }} />);
  if (!cdp) return (<Redirect to="/onboarding" />);
  // TODO IF HAS ACCOUNT AND NOT PASSED ONBOARDING GO TO ONBOARDING

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
  account: PropTypes.string,
  cdp: PropTypes.object,
};

const mapStateToProps = ({ general }) => ({
  account: general.account,
  connectingProvider: general.connectingProvider,
  cdp: general.cdp,
});

export default connect(mapStateToProps)(withRouter(PrivateRoute));

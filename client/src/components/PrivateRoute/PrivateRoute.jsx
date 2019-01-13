import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = ({
  component: Component, account, match, connectingProvider, ...rest
}) => {
  if (connectingProvider) return (<div>Connecting provider, please wait.</div>);
  if (!account) return (<Redirect to={{ pathname: '/connect', state: { to: rest.path } }} />);
  // TODO IF HAS ACCOUNT AND NOT PASSED ONBOARDING GO TO ONBOARDING

  return (
    <Route {...rest} render={props => (<Component {...props} />)} />
  );
};

PrivateRoute.defaultProps = {
  account: '',
};

PrivateRoute.propTypes = {
  match: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  account: PropTypes.string,
};

const mapStateToProps = ({ general }) => ({
  account: general.account,
  connectingProvider: general.connectingProvider,
});

export default connect(mapStateToProps)(withRouter(PrivateRoute));

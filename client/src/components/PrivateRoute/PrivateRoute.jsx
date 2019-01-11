import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { LS_ACCOUNT } from '../../constants/general';

const PrivateRoute = ({
  component: Component, account, ...rest
}) => {
  const to = rest.path;

  // IN LS PUT Preferred METHOD OF CONNECTION AND TRY SILENT, check if finished onboarding
  const existingLogin = JSON.parse(localStorage.getItem(LS_ACCOUNT));

  // IF EXISTING LOGIN TYPE IS METAMASK THEN TRY SILENT
  if (!existingLogin || !account) {
    return (<Redirect to={{ pathname: '/onboarding/connect', state: { to } }} />);
  }

  return (
    <Component {...rest} />
  );
};

PrivateRoute.defaultProps = {
  account: '',
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  account: PropTypes.string,
};

const mapStateToProps = ({ general }) => ({
  account: general.account,
});

export default connect(mapStateToProps)(PrivateRoute);

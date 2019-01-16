import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const DashboardRedirect = ({ match }) => (
  <Redirect to={`${match.path}/manage`} />
);

DashboardRedirect.propTypes = {
  match: PropTypes.object.isRequired,
};

export default DashboardRedirect;

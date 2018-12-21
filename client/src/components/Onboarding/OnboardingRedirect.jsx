import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const OnboardigRedirect = ({ match }) => (
  <Redirect to={`${match.path}/connect`} />
);

OnboardigRedirect.propTypes = {
  match: PropTypes.object.isRequired,
};

export default OnboardigRedirect;

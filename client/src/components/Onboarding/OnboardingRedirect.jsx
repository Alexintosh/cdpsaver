import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const OnboardingWizardRedirect = ({ match }) => (
  <Redirect to={`${match.path}/create-cdp`} />
);

OnboardingWizardRedirect.propTypes = {
  match: PropTypes.object.isRequired,
};

export default OnboardingWizardRedirect;

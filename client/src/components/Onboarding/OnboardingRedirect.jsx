import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const OnboardingWizardRedirect = ({ match, hasCdp }) => (
  <Redirect to={`${match.path}/${!hasCdp ? 'create-cdp' : 'info'}`} />
);

OnboardingWizardRedirect.propTypes = {
  match: PropTypes.object.isRequired,
  hasCdp: PropTypes.bool.isRequired,
};

export default OnboardingWizardRedirect;

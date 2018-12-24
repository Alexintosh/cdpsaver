import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import OnboardingRedirect from './OnboardingRedirect';
import OnbardingConnect from './OnbardingConnect/OnbardingConnect';

import './Onboarding.scss';

const OnboardingRoutes = ({ match }) => (
  <React.Fragment>
    <Route exact path={`${match.path}`} component={OnboardingRedirect} />
    <Route path={`${match.path}/connect`} component={OnbardingConnect} />
  </React.Fragment>
);

OnboardingRoutes.propTypes = {
  match: PropTypes.object.isRequired,
};

export default OnboardingRoutes;

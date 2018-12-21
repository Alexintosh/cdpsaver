import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import OnboardingRedirect from './OnboardingRedirect';
import OnbardingConnect from './OnbardingConnect/OnbardingConnect';

import './Onboarding.scss';

const OnboardingRoutes = ({ match }) => (
  <React.Fragment>
    <div className="sub-heading-wrapper">
      <div className="width-container">
        <div className="sub-title">Onboarding</div>
        <div className="sub-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </div>
      </div>
    </div>

    <div className="onboarding-wrapper">
      <Route exact path={`${match.path}`} component={OnboardingRedirect} />
      <Route path={`${match.path}/connect`} component={OnbardingConnect} />
    </div>
  </React.Fragment>
);

OnboardingRoutes.propTypes = {
  match: PropTypes.object.isRequired,
};

export default OnboardingRoutes;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetOnboardingWizard } from '../../../actions/onboardingActions';
import OnboardingWizardRedirect from './OnboardingWizardRedirect';
import OnboardingWizardCreateCdp from './OnboardingWizardCreateCdp/OnboardingWizardCreateCdp';

import './OnboardingWizard.scss';

class OnboardingWizardRoutes extends Component {
  componentWillUnmount() {
    this.props.resetOnboardingWizard();
  }

  render() {
    const { match, hasCdp } = this.props;
    return (
      <div className="onboarding-wizard-wrapper">
        <React.Fragment>
          <Route path={match.path} exact component={props => <OnboardingWizardRedirect hasCdp={hasCdp} {...props} />} />
          <Route
            path={`${match.path}/create-cdp`}
            component={props => <OnboardingWizardCreateCdp hasCdp={hasCdp} {...props} />}
          />
        </React.Fragment>
      </div>
    );
  }
}

OnboardingWizardRoutes.propTypes = {
  hasCdp: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  resetOnboardingWizard: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  resetOnboardingWizard,
};

const mapStateToProps = ({ general }) => ({
  hasCdp: general.hascCdp,
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardRoutes);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetOnboardingWizard } from '../../../actions/onboardingActions';
import OnboardingWizardRedirect from './OnboardingWizardRedirect';
import OnboardingWizardCreateCdp from './OnboardingWizardCreateCdp/OnboardingWizardCreateCdp';
import SubHeaderRoutes from '../../SubHeaderRoutes/SubHeaderRoutes';

import './OnboardingWizard.scss';

const ONBOARDING_WIZARD_LINKS = [
  { lebel: 'Create CDP', pathname: '/onboarding/wizard/create-cdp' },
  { lebel: 'Info', pathname: '/onboarding/wizard/info' },
  { lebel: 'Monitoring', pathname: '/onboarding/wizard/monitoring' },
  { lebel: 'Transfer', pathname: '/onboarding/wizard/transfer' },
];

class OnboardingWizardRoutes extends Component {
  componentWillUnmount() {
    this.props.resetOnboardingWizard();
  }

  render() {
    const { match, hasCdp } = this.props;

    const onboardingWizardLinks = ONBOARDING_WIZARD_LINKS;
    if (hasCdp) onboardingWizardLinks.splice(0, 1);

    return (
      <div className="onboarding-wizard-wrapper">
        <SubHeaderRoutes data={onboardingWizardLinks} />

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
  hasCdp: general.hasCdp,
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardRoutes);

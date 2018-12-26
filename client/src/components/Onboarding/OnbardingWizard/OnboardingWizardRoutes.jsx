import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetOnboardingWizard } from '../../../actions/onboardingActions';
import SubHeaderRoutes from '../../SubHeaderRoutes/SubHeaderRoutes';
import OnboardingWizardRedirect from './OnboardingWizardRedirect';
import OnboardingWizardCreateCdp from './OnboardingWizardCreateCdp/OnboardingWizardCreateCdp';
import OnboardingWizardInfo from './OnboardingWizardInfo/OnboardingWizardInfo';
import OnboardingWizardMonitoring from './OnboardingWizardMonitoring/OnboardingWizardMonitoring';
import OnboardingWizardTransfer from './OnboardingWizardTransfer/OnboardingWizardTransfer';

import './OnboardingWizard.scss';

const ONBOARDING_WIZARD_LINKS = [
  { lebel: 'Create CDP', pathname: '/onboarding/wizard/create-cdp' },
  { lebel: 'Info', pathname: '/onboarding/wizard/info' },
  { lebel: 'Monitoring', pathname: '/onboarding/wizard/monitoring' },
  { lebel: 'Transfer', pathname: '/onboarding/wizard/transfer' },
];

class OnboardingWizardRoutes extends Component {
  componentWillMount() {
    this.onboardingWizardLinks = ONBOARDING_WIZARD_LINKS;
    if (this.props.hasCdp) this.onboardingWizardLinks.splice(0, 1);
  }

  componentWillUnmount() {
    this.props.resetOnboardingWizard();
  }

  render() {
    const { match, hasCdp } = this.props;

    return (
      <div className="onboarding-wizard-wrapper">
        <SubHeaderRoutes data={this.onboardingWizardLinks} />

        <React.Fragment>
          <Route path={match.path} exact component={props => <OnboardingWizardRedirect hasCdp={hasCdp} {...props} />} />
          <Route
            path={`${match.path}/create-cdp`}
            component={props => <OnboardingWizardCreateCdp hasCdp={hasCdp} {...props} />}
          />
          <Route path={`${match.path}/info`} component={OnboardingWizardInfo} />
          <Route path={`${match.path}/monitoring`} component={OnboardingWizardMonitoring} />
          <Route path={`${match.path}/transfer`} component={OnboardingWizardTransfer} />
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
  hasCdp: !!general.cdp,
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardRoutes);

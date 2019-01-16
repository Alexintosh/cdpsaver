import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { resetOnboardingWizard } from '../../actions/onboardingActions';
import OnboardingRedirect from './OnboardingRedirect';
import SubHeaderRoutes from '../SubHeaderRoutes/SubHeaderRoutes';
import OnboardingCreateCdp from './OnboardingCreateCdp/OnboardingCreateCdp';
import OnboardingInfo from './OnboardingInfo/OnboardingInfo';
import OnboardingMonitoring from './OnboardingMonitoring/OnboardingMonitoring';
import OnboardingTransfer from './OnboardingTransfer/OnboardingTransfer';

import './Onboarding.scss';

class OnboardingRoutes extends Component {
  constructor(props) {
    super(props);

    this.onboardingWizardLinks = [
      { lebel: 'Create CDP', pathname: '/onboarding/create-cdp' },
      { lebel: 'Info', pathname: '/onboarding/info' },
      { lebel: 'Monitoring', pathname: '/onboarding/monitoring' },
      { lebel: 'Transfer', pathname: '/onboarding/transfer' },
    ];
  }

  componentWillMount() {
    // TODO HE ALREADY COMPLETED THE ONBOARDING THEN REDIRECT HIM
    if (!this.props.hasCdp) return;

    this.onboardingWizardLinks.splice(0, 1);
  }

  componentWillUnmount() {
    this.props.resetOnboardingWizard();
  }

  render() {
    const {
      match, hasCdp, account, connectingProvider, gettingCdp,
      onboardingFinished, loggingIn,
    } = this.props;

    if (onboardingFinished) return (<Redirect to="/dashboard/manage" />);

    // TODO CHECK IF THIS NEEDS TO BE GENERALIZED
    if (connectingProvider) return (<div>Connecting provider, please wait.</div>);
    if (gettingCdp) return (<div>Getting your cdp, please wait...</div>);
    if (loggingIn && (!connectingProvider && !gettingCdp)) return (<div>Logging in...</div>);

    if (!loggingIn && !account && !connectingProvider) {
      return (<Redirect to={{ pathname: '/connect', state: { to: '/dashboard/manage' } }} />);
    }

    return (
      <div className="onboarding-wrapper">
        <SubHeaderRoutes data={this.onboardingWizardLinks} />

        <React.Fragment>
          <Route path={match.path} exact component={props => <OnboardingRedirect hasCdp={hasCdp} {...props} />} />
          <Route
            path={`${match.path}/create-cdp`}
            component={props => <OnboardingCreateCdp hasCdp={hasCdp} {...props} />}
          />
          <Route path={`${match.path}/info`} component={OnboardingInfo} />
          <Route path={`${match.path}/monitoring`} component={OnboardingMonitoring} />
          <Route path={`${match.path}/transfer`} component={OnboardingTransfer} />
        </React.Fragment>
      </div>
    );
  }
}

OnboardingRoutes.propTypes = {
  account: PropTypes.string.isRequired,
  hasCdp: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  resetOnboardingWizard: PropTypes.func.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  gettingCdp: PropTypes.bool.isRequired,
  onboardingFinished: PropTypes.bool.isRequired,
  loggingIn: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  resetOnboardingWizard,
};

const mapStateToProps = ({ general, onboarding }) => ({
  hasCdp: !!general.cdp,
  account: general.account,
  connectingProvider: general.connectingProvider,
  gettingCdp: general.gettingCdp,
  loggingIn: general.loggingIn,
  onboardingFinished: onboarding.onboardingFinished,
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingRoutes);

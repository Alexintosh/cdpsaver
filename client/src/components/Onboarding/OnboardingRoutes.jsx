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
import Loader from '../Loader/Loader';

import './Onboarding.scss';

class OnboardingRoutes extends Component {
  constructor(props) {
    super(props);

    this.onboardingWizardLinks = [
      { label: 'Create CDP', pathname: '/onboarding/create-cdp' },
      { label: 'Info', pathname: '/onboarding/info' },
      { label: 'Monitoring', pathname: '/onboarding/monitoring' },
      { label: 'Transfer', pathname: '/onboarding/transfer' },
    ];
  }

  componentWillUnmount() {
    this.props.resetOnboardingWizard();
  }

  render() {
    const {
      match, hasCdp, account, connectingProvider, gettingCdp, loggingIn,
    } = this.props;
    const showloggingIn = loggingIn && (!connectingProvider && !gettingCdp);
    const showLoader = connectingProvider || gettingCdp || showloggingIn;

    if (showLoader) {
      let message = '';

      if (loggingIn) message = 'Logging in, please wait...';
      if (connectingProvider) message = 'Connecting web3 provider, please wait...';
      if (gettingCdp) message = 'Getting your cdp, please wait...';

      return (
        <div className="loader-page-wrapper private">
          <Loader message={message} />
        </div>
      );
    }

    if (!loggingIn && !account && !connectingProvider) {
      return (<Redirect to={{ pathname: '/connect', state: { to: '/dashboard/manage' } }} />);
    }

    if (hasCdp && this.onboardingWizardLinks.length === 4) {
      this.onboardingWizardLinks.splice(0, 1);
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
  loggingIn: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  resetOnboardingWizard,
};

const mapStateToProps = ({ general }) => ({
  hasCdp: !!general.cdp,
  account: general.account,
  connectingProvider: general.connectingProvider,
  gettingCdp: general.gettingCdp,
  loggingIn: general.loggingIn,
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingRoutes);

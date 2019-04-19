import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import OnboardingCreateCdp from './OnboardingCreateCdp';
import SwitchToDesktop from '../SwitchToDesktop/SwitchToDesktop';
import { isMobileDevice } from '../../utils/utils';

import '../Onboarding/Onboarding.scss';

const CreateCdpRoute = ({
  match, account, connectingProvider, gettingCdp, loggingIn,
}) => {
  if (isMobileDevice()) return (<SwitchToDesktop />);

  const showloggingIn = loggingIn && (!connectingProvider && !gettingCdp);
  const showLoader = connectingProvider || gettingCdp || showloggingIn;

  if (showLoader) {
    let message = '';

    if (loggingIn) message = 'Logging in, please wait...';
    if (connectingProvider) message = 'Connecting web3 provider, please wait...';
    if (gettingCdp) message = 'Getting your CDP, please wait...';

    return (
      <div className="loader-page-wrapper private">
        <Loader message={message} />
      </div>
    );
  }

  if (!loggingIn && !account && !connectingProvider) {
    return (<Redirect to={{ pathname: '/connect', state: { to: '/dashboard/manage' } }} />);
  }

  return (
    <div className="onboarding-wrapper dashboard-page-wrapper">
      <div className="sub-heading-wrapper">
        <div className="width-container">
          <div className="sub-title">Create CDP</div>
        </div>
      </div>

      <React.Fragment>
        <Route path={`${match.path}/`} component={OnboardingCreateCdp} />
      </React.Fragment>
    </div>
  );
};

CreateCdpRoute.propTypes = {
  account: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  connectingProvider: PropTypes.bool.isRequired,
  gettingCdp: PropTypes.bool.isRequired,
  loggingIn: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ general }) => ({
  account: general.account,
  connectingProvider: general.connectingProvider,
  gettingCdp: general.gettingCdp,
  loggingIn: general.loggingIn,
});

export default connect(mapStateToProps)(CreateCdpRoute);

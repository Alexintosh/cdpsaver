import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import OnboardingWizardMonitoringForm from './OnboardingMonitoringForm/OnboardingMonitoringForm';

import './OnboardingMonitoring.scss';
import { finishOnboarding } from '../../../actions/onboardingActions';

const OnboardingMonitoring = ({
  cdp, subscribingToMonitoringSuccess, history, finishOnboarding,
}) => {
  if (!cdp) return (<Redirect to="/onboarding/create-cdp" />);

  return (
    <div className="onboarding-monitoring-wrapper onboarding-page-wrapper">
      <div className="onboarding-content-bg">
        <div className="onboarding-content-wrapper no-margin width-container">
          {
            !subscribingToMonitoringSuccess && (
              <div className="content-heading">
                Get notified right away!
              </div>
            )
          }

          {
            subscribingToMonitoringSuccess && (
              <div className="content-heading">
                Successfully subscribed!
              </div>
            )
          }

          { !subscribingToMonitoringSuccess && <OnboardingWizardMonitoringForm /> }

          {
            subscribingToMonitoringSuccess && (
              <div className="content-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu
                pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
                Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam.
              </div>
            )
          }
        </div>

        <div className="bottom-controls width-container">
          <Link to="/onboarding/info" className="button gray uppercase">
            Previous
          </Link>

          <button type="button" className="button green uppercase" onClick={() => { finishOnboarding(history); }}>
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

OnboardingMonitoring.defaultProps = {
  cdp: null,
};

OnboardingMonitoring.propTypes = {
  history: PropTypes.object.isRequired,
  finishOnboarding: PropTypes.func.isRequired,
  cdp: PropTypes.object,
  subscribingToMonitoringSuccess: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ general, onboarding }) => ({
  cdp: general.cdp,
  subscribingToMonitoringSuccess: onboarding.subscribingToMonitoringSuccess,
});

const mapDispatchToProps = {
  finishOnboarding,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingMonitoring);

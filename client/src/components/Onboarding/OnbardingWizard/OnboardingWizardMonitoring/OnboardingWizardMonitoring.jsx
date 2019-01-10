import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import OnboardingWizardMonitoringForm from './OnboardingWizardMonitoringForm/OnboardingWizardMonitoringForm';

import './OnboardingWizardMonitoring.scss';

const OnboardingWizardMonitoring = ({ cdp, subscribingToMonitoringSuccess }) => {
  if (!cdp) return (<Redirect to="/onboarding/wizard/create-cdp" />);

  return (
    <div className="onboarding-wizard-monitoring-wrapper onboarding-page-wrapper">
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
          <Link to="/onboarding/wizard/info" className="button gray uppercase">
            Previous
          </Link>

          <Link to="/onboarding/wizard/transfer" className="button green uppercase">
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

OnboardingWizardMonitoring.defaultProps = {
  cdp: null,
};

OnboardingWizardMonitoring.propTypes = {
  cdp: PropTypes.object,
  subscribingToMonitoringSuccess: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ general, onboarding }) => ({
  cdp: general.cdp,
  subscribingToMonitoringSuccess: onboarding.subscribingToMonitoringSuccess,
});

export default connect(mapStateToProps)(OnboardingWizardMonitoring);

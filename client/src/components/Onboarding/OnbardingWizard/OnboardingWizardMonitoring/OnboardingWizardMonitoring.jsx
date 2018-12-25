import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import OnboardingWizardMonitoringForm from './OnboardingWizardMonitoringForm/OnboardingWizardMonitoringForm';

import './OnboardingWizardMonitoring.scss';

const OnboardingWizardMonitoring = ({ cdp, history }) => {
  if (!cdp) return (<Redirect to="/onboarding/wizard/create-cdp" />);

  return (
    <div className="onboarding-wizard-monitoring-wrapper onboarding-page-wrapper">
      <div className="onboarding-content-bg">
        <div className="onboarding-content-wrapper no-margin width-container">
          <div className="content-heading">
            Get notified right away!
          </div>

          <OnboardingWizardMonitoringForm history={history} />
        </div>

        <div className="onboardin-controls width-container">
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
  history: PropTypes.object.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
});

export default connect(mapStateToProps)(OnboardingWizardMonitoring);

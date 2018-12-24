import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './OnboardingWizardCreateCdp.scss';

const OnboardingWizardCreateCdp = ({ hasCdp }) => {
  if (hasCdp) return (<Redirect to="/onboarding/wizard/info" />);

  return (
    <div className="onboarding-wizard-create-cdp-wrapper onboarding-page-wrapper">
      <div className="onboarding-content-bg">
        <div className="onboarding-content-wrapper width-container">

          <div className="connect-heading">
            Create
            <span>CDP</span>
          </div>
          <div className="connect-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          </div>

          {/* FORM GOES HERE */}
        </div>
      </div>
    </div>
  );
};

OnboardingWizardCreateCdp.propTypes = {
  hasCdp: PropTypes.bool.isRequired,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(OnboardingWizardCreateCdp);

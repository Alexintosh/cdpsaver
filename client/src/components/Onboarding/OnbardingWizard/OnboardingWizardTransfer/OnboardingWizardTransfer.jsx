import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './OnboardingWizardTransfer.scss';

const OnboardingWizardTransfer = ({ cdp }) => {
  if (!cdp) return (<Redirect to="/onboarding/wizard/create-cdp" />);

  return (
    <div className="onboarding-wizard-transfer-wrapper onboarding-page-wrapper">
      <div className="onboarding-content-bg">
        <div className="onboarding-content-wrapper no-margin width-container">
          <div className="content-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu
            pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
            Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam.
          </div>

          <button type="button" className="button green uppercase">Transfer</button>
        </div>

        <div className="bottom-controls width-container">
          <Link to="/onboarding/wizard/monitoring" className="button gray uppercase">
            Previous
          </Link>

          <Link to="/dashboard" className="button green uppercase">
            Finish
          </Link>
        </div>
      </div>
    </div>
  );
};

OnboardingWizardTransfer.defaultProps = {
  cdp: null,
};

OnboardingWizardTransfer.propTypes = {
  cdp: PropTypes.object,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
});

export default connect(mapStateToProps)(OnboardingWizardTransfer);

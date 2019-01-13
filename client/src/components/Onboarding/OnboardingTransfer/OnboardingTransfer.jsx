import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { finishOnboarding } from '../../../actions/onboardingActions';

import './OnboardingTransfer.scss';

const OnboardingTransfer = ({ cdp, history, finishOnboarding }) => {
  if (!cdp) return (<Redirect to="/onboarding/create-cdp" />);

  return (
    <div className="onboarding-transfer-wrapper onboarding-page-wrapper">
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
          <Link to="/onboarding/monitoring" className="button gray uppercase">
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

OnboardingTransfer.defaultProps = {
  cdp: null,
};

OnboardingTransfer.propTypes = {
  cdp: PropTypes.object,
  history: PropTypes.object.isRequired,
  finishOnboarding: PropTypes.func.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
});

const mapDispatchToProps = {
  finishOnboarding,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingTransfer);

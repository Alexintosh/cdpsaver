import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './OnboardingWizardInfo.scss';

const OnboardingWizardInfo = ({ cdp }) => {
  if (!cdp) return (<Redirect to="/onboarding/wizard/create-cdp" />);

  return (
    <div className="onboarding-wizard-info-wrapper onboarding-page-wrapper">
      <div className="onboarding-content-bg">
        <div className="onboarding-content-wrapper no-margin width-container">

          <div className="info-row-wrapper">
            <div className="info-item-wrapper">
              <div className="info-label">Liquidation price</div>
              <div className="info-value">{ cdp.liquidationPrice.toFixed(2) }$</div>
            </div>

            <div className="info-item-wrapper">
              <div className="info-label">Current price</div>
              <div className="info-value">150$</div>
            </div>

            <div className="info-item-wrapper">
              <div className="info-label">Ratio</div>
              <div className="info-value">{ (cdp.ratio * 100).toFixed(2) }%</div>
            </div>
          </div>

          <div className="info-row-small-wrapper">
            <div className="info-label">Debt:</div>
            <div className="info-value">{ cdp.debtDai.toFixed(2) } Dai</div>
          </div>

          <div className="info-row-small-wrapper">
            <div className="info-label">Collateral amount:</div>
            <div className="info-value">{ cdp.depositedETH.toFixed(2) } Eth</div>
          </div>
        </div>

        <div className="onboardin-controls width-container">
          <Link to="/onboarding/wizard/monitoring" className="button green uppercase">
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

OnboardingWizardInfo.defaultProps = {
  cdp: null,
};

OnboardingWizardInfo.propTypes = {
  cdp: PropTypes.object,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
});

export default connect(mapStateToProps)(OnboardingWizardInfo);

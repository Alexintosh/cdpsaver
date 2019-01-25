import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatNumber } from '../../../utils/utils';

import './OnboardingInfo.scss';

const OnboardingInfo = ({
  cdp, gettingEthPrice, ethPrice,
}) => {
  if (!cdp) return (<Redirect to="/onboarding/create-cdp" />);

  return (
    <div className="onboarding-info-wrapper onboarding-page-wrapper">
      <div className="onboarding-content-bg">
        <div className="onboarding-content-wrapper no-margin width-container">

          <div className="info-row-wrapper">
            <div className="info-item-wrapper">
              <div className="info-label">Liquidation price</div>
              <div className="info-value">{ formatNumber(cdp.liquidationPrice, 2) }$</div>
            </div>

            <div className="info-item-wrapper">
              <div className="info-label">Current price</div>
              <div className="info-value">{ gettingEthPrice ? 'Loading...' : ethPrice }</div>
            </div>

            <div className="info-item-wrapper">
              <div className="info-label">Ratio</div>
              <div className="info-value">{ formatNumber(cdp.ratio, 2) }%</div>
            </div>
          </div>

          <div className="info-row-small-wrapper">
            <div className="info-label">Debt:</div>
            <div className="info-value">{ formatNumber(cdp.debtDai, 2) } Dai</div>
          </div>

          <div className="info-row-small-wrapper">
            <div className="info-label">Collateral amount:</div>
            <div className="info-value">{ formatNumber(cdp.depositedETH, 2) } Eth</div>
          </div>
        </div>

        <div className="bottom-controls width-container">
          <Link to="/onboarding/monitoring" className="button green uppercase">
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

OnboardingInfo.defaultProps = {
  cdp: null,
};

OnboardingInfo.propTypes = {
  cdp: PropTypes.object,
  ethPrice: PropTypes.number.isRequired,
  gettingEthPrice: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
  ethPrice: general.ethPrice,
  gettingEthPrice: general.gettingEthPrice,
});

export default connect(mapStateToProps)(OnboardingInfo);

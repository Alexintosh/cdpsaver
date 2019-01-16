import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './SaverPage.scss';

const SaverPage = ({
  cdp, gettingEthPrice, ethPrice,
}) => (
  <div className="saver-page-wrapper dashboard-page-wrapper">
    <div className="sub-heading-wrapper">
      <div className="width-container">
        <div className="sub-title">CDP Saver</div>
      </div>
    </div>

    <div className="content-wrapper">
      <div className="width-container">
        <div className="info-section">
          <div className="main-items-wrapper">
            <div className="item">
              <div className="label">Liquidation price</div>
              <div className="value">{ gettingEthPrice ? 'Loading...' : ethPrice }</div>
            </div>

            <div className="item">
              <div className="label">Current price</div>
              <div className="value">78$</div>
            </div>

            <div className="item">
              <div className="label">Ratio</div>
              <div className="value">{ (cdp.ratio * 100).toFixed(2) }%</div>
            </div>
          </div>

          <div className="row-item-wrapper">
            <span className="label">Debt:</span>
            <span className="value">{ cdp.debtDai.toFixed(2) } Dai</span>
          </div>

          <div className="row-item-wrapper">
            <span className="label">Collateral amount:</span>
            <span className="value">{ cdp.depositedETH.toFixed(2) } Eth</span>
          </div>
        </div>

        <div className="dual-sections-wrapper">
          <div className="section action">
            <div className="section-title">Unwind</div>

            <div className="temp-form-wrapper">Save my cdp when:</div>

            <button type="button" className="button green uppercase" onClick={() => {}}>
              Subscribe
            </button>
          </div>

          <div className="separator" />

          <div className="section additional">
            <div className="additional-row">
              <div className="additional-item">
                <div className="label">New Liq. price:</div>
                <div className="value">38$</div>
              </div>

              <div className="additional-item">
                <div className="label">New Debt:</div>
                <div className="value">380 DAI</div>
              </div>
            </div>

            <div className="additional-row">
              <div className="additional-item">
                <div className="label">New Ratio:</div>
                <div className="value">280%</div>
              </div>

              <div className="additional-item">
                <div className="label">New Collateral:</div>
                <div className="value">100 ETH</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

SaverPage.propTypes = {
  cdp: PropTypes.object.isRequired,
  ethPrice: PropTypes.number.isRequired,
  gettingEthPrice: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
  ethPrice: general.ethPrice,
  gettingEthPrice: general.gettingEthPrice,
});

export default connect(mapStateToProps)(SaverPage);

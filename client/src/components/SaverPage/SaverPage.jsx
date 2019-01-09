import React from 'react';

import './SaverPage.scss';

const SaverPage = () => (
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
              <div className="value">48$</div>
            </div>

            <div className="item">
              <div className="label">Current price</div>
              <div className="value">78$</div>
            </div>

            <div className="item">
              <div className="label">Ratio</div>
              <div className="value">220%</div>
            </div>
          </div>

          <div className="row-item-wrapper">
            <span className="label">Debt:</span>
            <span className="value">3600 Dai</span>
          </div>

          <div className="row-item-wrapper">
            <span className="label">Collateral amount:</span>
            <span className="value">360 Eth</span>
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

SaverPage.propTypes = {};

export default SaverPage;

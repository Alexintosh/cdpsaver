import React from 'react';
import PropTypes from 'prop-types';

import './CdpBox.scss';

const CdpBox = ({
  data: {
    depositedETH, depositedPETH, depositedUSD, generatedDAI, liquidationPrice,
  },
}) => (
  <div className="cdp-box-wrapper">
    <div className="deposit-wrapper">
      <div className="deposit-heading">Deposited</div>

      <div className="deposited-main">
        <div className="deposit-value">{ depositedETH.toFixed(3) }</div>
        <div className="deposit-label">ETH</div>
      </div>

      <div className="deposit-additional">
        <div className="additional-item">
          { depositedPETH.toFixed(3) } <span>PETH</span>
        </div>

        <div className="additional-item">
          { depositedUSD.toFixed(3) } <span>USD</span>
        </div>
      </div>
    </div>

    <div className="sections-wrapper">
      <div className="section-wrapper">
        <div className="section-heading">Generated</div>

        <div className="section-main">
          <div className="section-value">{ generatedDAI.toFixed(3) }</div>
          <div className="section-label">DAI</div>
        </div>

        <div className="section-additional">
          <div className="section-item">
            { generatedDAI.toFixed(3) } <span>USD</span>
          </div>
        </div>
      </div>

      <div className="section-wrapper">
        <div className="section-heading">Liquidation price (ETH/USD)</div>

        <div className="section-main">
          <div className="section-value">{ liquidationPrice.toFixed(3) }</div>
          <div className="section-label">USD</div>
        </div>
      </div>
    </div>
  </div>
);

CdpBox.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CdpBox;

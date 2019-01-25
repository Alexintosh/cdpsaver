import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../../../utils/utils';

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
        <div className="deposit-value">{ formatNumber(depositedETH, 3) }</div>
        <div className="deposit-label">ETH</div>
      </div>

      <div className="deposit-additional">
        <div className="additional-item">
          { formatNumber(depositedPETH, 3) } <span>PETH</span>
        </div>

        <div className="additional-item">
          { formatNumber(depositedUSD, 3) } <span>USD</span>
        </div>
      </div>
    </div>

    <div className="sections-wrapper">
      <div className="section-wrapper">
        <div className="section-heading">Generated</div>

        <div className="section-main">
          <div className="section-value">{ formatNumber(generatedDAI, 3) }</div>
          <div className="section-label">DAI</div>
        </div>

        <div className="section-additional">
          <div className="section-item">
            { formatNumber(generatedDAI, 3) } <span>USD</span>
          </div>
        </div>
      </div>

      <div className="section-wrapper">
        <div className="section-heading">Liquidation price (ETH/USD)</div>

        <div className="section-main">
          <div className="section-value">{ formatNumber(liquidationPrice, 3) }</div>
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

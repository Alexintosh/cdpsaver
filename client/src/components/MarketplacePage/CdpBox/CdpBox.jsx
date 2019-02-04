import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { formatNumber } from '../../../utils/utils';
import { buyCdp } from '../../../actions/marketplaceActions';

import './CdpBox.scss';

const CdpBox = ({
  data: {
    depositedETH, depositedPETH, depositedUSD, generatedDAI, liquidationPrice, id, ratio,
  },
  buyingCdp, buyingCdpError, buyCdp,
}) => (
  <div className="cdp-box-wrapper">
    <div className="main-section-wrapper">
      <div className="box-heading">
        <div className="id-wrapper">
          <span>Cdp id:</span>
          <span className="id">#{ id }</span>
        </div>

        <div className="discount-wrapper">
          <span className="discount">3%</span>
          <span>Discount</span>
        </div>
      </div>

      <div className="price-wrapper">
        <div className="price-label">Price:</div>

        <div className="price-eth">
          <div className="price-eth-value">325.753</div>
          <div className="price-eth-label">ETH</div>
        </div>

        <div className="price-usd">
          <div className="price-usd-value">491.127</div>
          <div className="price-usd-label">USD</div>
        </div>
      </div>
    </div>

    <div className="bottom-section-wrapper">
      <div className="value-wrapper">
        <div className="value-label">CDP value:</div>

        <div className="value-eth">
          <div className="value-eth-value">325.753</div>
          <div className="value-eth-label">ETH</div>
        </div>

        <div className="value-usd">
          <div className="value-usd-value">491.127</div>
          <div className="value-usd-label">USD</div>
        </div>
      </div>

      <div className="data-wrapper">
        <div className="data-item">
          <div className="label">Ratio:</div>
          <div className="value">
            <Tooltip title={ratio}>
              { formatNumber(ratio, 2) }%
            </Tooltip>
          </div>
        </div>

        <div className="data-item">
          <div className="label">Liquidation price:</div>
          <div className="value">
            <Tooltip title={liquidationPrice}>
              { formatNumber(liquidationPrice, 2) }%
            </Tooltip>
          </div>
        </div>
      </div>
    </div>

    <div className="buy-wrapper">
      <button
        type="button"
        className="button green uppercase"
        onClick={buyCdp}
        disabled={buyingCdp}
      >
        { buyingCdp ? 'Buying' : 'Buy' }
      </button>
    </div>
  </div>
);

CdpBox.propTypes = {
  data: PropTypes.object.isRequired,
  buyingCdp: PropTypes.bool.isRequired,
  buyingCdpError: PropTypes.string.isRequired,
  buyCdp: PropTypes.func.isRequired,
};

const mapStateToProps = ({ marketplace }) => ({
  buyingCdp: marketplace.buyingCdp,
  buyingCdpError: marketplace.buyingCdpError,
});

const mapDispatchToProps = {
  buyCdp,
};

export default connect(mapStateToProps, mapDispatchToProps)(CdpBox);

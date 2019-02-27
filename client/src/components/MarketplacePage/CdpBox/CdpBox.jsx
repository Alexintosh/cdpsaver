import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { formatNumber } from '../../../utils/utils';
import { buyCdpAction } from '../../../actions/marketplaceActions';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';

import './CdpBox.scss';

const CdpBox = ({
  data: {
    discount, value, price, liquidationPrice, id, ratio,
    owner,
  },
  buyingCdp, buyCdpAction, proxyAddress,
}) => (
  <div className="cdp-box-wrapper">
    <div className="main-section-wrapper">
      <div className="box-heading">
        <div className="id-wrapper">
          <span>Cdp id:</span>
          <span className="id">#{ id }</span>
        </div>

        <div className="discount-wrapper">
          <span className="discount">
            <TooltipWrapper title={discount}>{ formatNumber(discount, 1) }%</TooltipWrapper>
          </span>
          <span>Discount</span>
        </div>
      </div>

      <div className="price-wrapper">
        <div className="price-label">Price:</div>

        <div className="price-eth">
          <div className="price-eth-value">
            <TooltipWrapper title={price.eth}>{ formatNumber(price.eth, 3) }</TooltipWrapper>
          </div>
          <div className="price-eth-label">ETH</div>
        </div>

        <div className="price-usd">
          <div className="price-usd-value">
            <TooltipWrapper title={price.usd}>{ formatNumber(price.usd, 3) }</TooltipWrapper>
          </div>
          <div className="price-usd-label">USD</div>
        </div>
      </div>
    </div>

    <div className="bottom-section-wrapper">
      <div className="value-wrapper">
        <div className="value-label">CDP value:</div>

        <div className="value-eth">
          <div className="value-eth-value">{ formatNumber(value.eth, 3) }</div>
          <div className="value-eth-label">ETH</div>
        </div>

        <div className="value-usd">
          <div className="value-usd-value">{ formatNumber(value.usd, 3) }</div>
          <div className="value-usd-label">USD</div>
        </div>
      </div>

      <div className="data-wrapper">
        <div className="data-item">
          <div className="label">Ratio:</div>
          <div className="value">
            <TooltipWrapper title={ratio}>
              { formatNumber(ratio, 2) }%
            </TooltipWrapper>
          </div>
        </div>

        <div className="data-item">
          <div className="label">Liquidation price:</div>
          <div className="value">
            <TooltipWrapper title={liquidationPrice}>
              { formatNumber(liquidationPrice, 2) }$
            </TooltipWrapper>
          </div>
        </div>
      </div>
    </div>

    <div className="buy-wrapper">
      <Tooltip
        title="You can't buy your own CDP"
        disabled={owner !== proxyAddress}
      >
        <button
          type="button"
          className="button green uppercase"
          onClick={() => { buyCdpAction(id); }}
          disabled={buyingCdp || owner === proxyAddress}
        >
          { buyingCdp ? 'Buying' : 'Buy' }
        </button>
      </Tooltip>
    </div>
  </div>
);

CdpBox.propTypes = {
  data: PropTypes.object.isRequired,
  buyingCdp: PropTypes.bool.isRequired,
  buyCdpAction: PropTypes.func.isRequired,
  proxyAddress: PropTypes.string.isRequired,
};

const mapStateToProps = ({ marketplace, general }) => ({
  buyingCdp: marketplace.buyingCdp,
  proxyAddress: general.proxyAddress,
});

const mapDispatchToProps = {
  buyCdpAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CdpBox);

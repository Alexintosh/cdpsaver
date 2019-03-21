import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { getMarketplaceCdpsData, sellCdpButtonTooltipText } from '../../actions/marketplaceActions';
import { openSellCdpModal, openCancelSellCdplModal } from '../../actions/modalActions';
import { MARKETPLACE_SORT_OPTIONS } from '../../constants/general';
import CdpBox from './CdpBox/CdpBox';
import Loader from '../Loader/Loader';

import './MarketplacePage.scss';

const MarketplacePage = ({
  cdps, fetchingCdpsError, fetchingCdps, getMarketplaceCdpsData, openSellCdpModal,
  loggingIn, gettingCdp, openCancelSellCdplModal, userCdps,
  proxyAddress,
}) => {
  const [mounted, setMounted] = useState(false);
  const [orderBy, setOrderBy] = useState(null);

  useEffect(async () => {
    if (!mounted) {
      getMarketplaceCdpsData();

      setMounted(true);
    }
  });

  // Proxy cdps is put here because user owned cpds can't call
  // our marketplace smart contract
  const proxyCdps = userCdps.filter(_cdp => _cdp.owner === proxyAddress);
  const onSaleCdps = proxyCdps.filter(_cdp => _cdp.onSale);
  const notOnSaleCdps = proxyCdps.filter(_cdp => !_cdp.onSale);

  const hasCdp = proxyCdps.length > 0;
  const allOnSale = proxyCdps.length === onSaleCdps.length;
  const atLeastOneOnSale = onSaleCdps.length > 0;

  return (
    <div className="marketplace-page-wrapper dashboard-page-wrapper">
      <div className="sub-heading-wrapper">
        <div className="width-container">
          <div className="sub-title">Marketplace</div>
          <div className="sub-text">
            Buy and sell CDPs at discount prices in the Marketplace.
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="width-container">
          <div className="filters-wrapper">
            <div className="filters">
              <div className="search-wrapper">
                <input placeholder="Search by ID" />

                <i className="icon-magnifying-glass" />
              </div>

              <div className="order-wrapper">
                <div className="select-label">Order by</div>

                <Select
                  className="select main-select main-select-small"
                  classNamePrefix="select"
                  value={orderBy}
                  onChange={setOrderBy}
                  options={MARKETPLACE_SORT_OPTIONS}
                />
              </div>
            </div>

            <div className="actions-wrapper">
              {
                atLeastOneOnSale && (
                  <button
                    onClick={() => { openCancelSellCdplModal(onSaleCdps); }}
                    disabled={false}
                    className="button green uppercase cancel"
                    type="button"
                  >
                    Cancel
                    <span>sell</span>
                  </button>
                )
              }

              <Tooltip
                title={sellCdpButtonTooltipText(loggingIn, gettingCdp, hasCdp, allOnSale)}
                disabled={hasCdp}
              >
                <button
                  onClick={() => { openSellCdpModal(notOnSaleCdps); }}
                  disabled={!hasCdp || allOnSale}
                  className="button green uppercase"
                  type="button"
                >
                  Sell
                  <span>Cdp</span>
                </button>
              </Tooltip>
            </div>
          </div>

          {
            fetchingCdps && (
              <div className="loader-page-wrapper">
                <Loader />
              </div>
            )
          }

          {
            !fetchingCdps && !fetchingCdpsError && cdps.length > 0 && (
              <div className="cdp-list-wrapper">
                { cdps.map(cdp => (<CdpBox data={cdp} key={cdp.id} />)) }
              </div>
            )
          }

          {
            !fetchingCdps && !fetchingCdpsError && cdps.length === 0 && (
              <div className="empty-page-wrapper">
                <i className="icon-empty" />
                <span>Put your CDP on sale, while your cdp is on sale you are still in control of the CDP</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

MarketplacePage.propTypes = {
  cdps: PropTypes.array.isRequired,
  userCdps: PropTypes.array.isRequired,
  proxyAddress: PropTypes.string.isRequired,
  getMarketplaceCdpsData: PropTypes.func.isRequired,
  fetchingCdps: PropTypes.bool.isRequired,
  fetchingCdpsError: PropTypes.any.isRequired,
  openSellCdpModal: PropTypes.func.isRequired,
  openCancelSellCdplModal: PropTypes.func.isRequired,
  loggingIn: PropTypes.bool.isRequired,
  gettingCdp: PropTypes.bool.isRequired,
};

const mapStateToProps = (({ marketplace, general }) => ({
  cdps: marketplace.cdps,
  fetchingCdps: marketplace.fetchingCdps,
  fetchingCdpsError: marketplace.fetchingCdpsError,

  loggingIn: general.loggingIn,
  gettingCdp: general.gettingCdp,
  userCdps: general.cdps,
  account: general.account,
  proxyAddress: general.proxyAddress,
}));

const mapDispatchToProps = {
  getMarketplaceCdpsData, openSellCdpModal, openCancelSellCdplModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketplacePage);

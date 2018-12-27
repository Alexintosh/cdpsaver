import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { getMarketplaceCdpsData } from '../../actions/marketplaceActions';
import { MARKETPLACE_SORT_OPTIONS } from '../../constants/general';

import './MarketplacePage.scss';

const MarketplacePage = ({ cdps, fetchingCdps, getMarketplaceCdpsData }) => {
  const [mounted, setMounted] = useState(false);
  const [orderBy, setOrderBy] = useState(null);

  useEffect(async () => {
    if (!mounted) {
      getMarketplaceCdpsData();

      setMounted(true);
    }
  });

  return (
    <div className="marketplace-page-wrapper dashboard-page-wrapper">
      <div className="sub-heading-wrapper">
        <div className="width-container">
          <div className="sub-title">Marketplace</div>
          <div className="sub-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
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

            <button className="button green uppercase" type="button">
              Sell
              <span>Cdp</span>
            </button>
          </div>

          <div className="cdp-list-wrapper">
            CDPS
          </div>
        </div>
      </div>
    </div>
  );
};

MarketplacePage.propTypes = {
  cdps: PropTypes.array.isRequired,
  fetchingCdps: PropTypes.bool.isRequired,
  getMarketplaceCdpsData: PropTypes.func.isRequired,
};

const mapStateToProps = (({ marketplace }) => ({
  cdps: marketplace.cdps,
  fetchingCdps: marketplace.fetchingCdps,
}));

const mapDispatchToProps = {
  getMarketplaceCdpsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketplacePage);

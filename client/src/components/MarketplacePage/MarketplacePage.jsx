import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { getMarketplaceCdpsData, sellCdpButtonTooltipText } from '../../actions/marketplaceActions';
import { openSellCdpModal, openCancelSellCdplModal } from '../../actions/modalActions';
import { MARKETPLACE_SORT_OPTIONS } from '../../constants/general';
import { addToLsState, getLsExistingItemAndState } from '../../utils/utils';
import CdpBox from './CdpBox/CdpBox';
import Loader from '../Loader/Loader';

import './MarketplacePage.scss';

const MarketplacePage = ({
  cdps, fetchingCdpsError, fetchingCdps, getMarketplaceCdpsData, openSellCdpModal,
  loggingIn, gettingCdp, openCancelSellCdplModal, userCdps, account,
  proxyAddress,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [orderBy, setOrderBy] = useState(null);
  const [filterId, setFilterId] = useState(null);

  useEffect(async () => {
    if (!mounted) {
      getMarketplaceCdpsData();
      setMounted(true);
    }

    if (!hasAccount && account) {
      const { existingItem } = getLsExistingItemAndState(account);
      if (existingItem && existingItem.orderBy) setOrderBy(existingItem.orderBy);

      setHasAccount(true);
    }
  });

  /**
   * Searches the loaded cdps by the search param
   *
   * @param val {String}
   */
  const searchCdps = (val) => {
    let id = parseInt(val, 10);

    if (!val) id = null;
    if (isNaN(id)) id = -1; // eslint-disable-line

    setFilterId(id);
  };

  /**
   * Saves se order by selected dropdown value
   * to the local storage and in the component
   *
   * @param item {Object}
   */
  const changeAccountMarketplaceOrderBy = (item) => {
    addToLsState({ account, orderBy: item });
    setOrderBy(item);
  };

  let cdpItems = cdps.filter(({ id }) => {
    if (filterId === null) return cdps;

    return id.toString().indexOf(filterId) > -1;
  });

  if (orderBy) {
    cdpItems = cdpItems.sort((a, b) => {
      const orderByArr = orderBy.value.split('-');
      const [prop, ascOrDesc] = orderByArr;

      if (ascOrDesc === 'desc') return b[prop] > a[prop] ? 1 : -1;

      return a[prop] > b[prop] ? 1 : -1;
    });
  }

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
                <input placeholder="Search by ID" onChange={({ target }) => { searchCdps(target.value); }} />

                <i className="icon-magnifying-glass" />
              </div>

              <div className="order-wrapper">
                <div className="select-label">Order by</div>

                <Select
                  className="select main-select main-select-small"
                  classNamePrefix="select"
                  value={orderBy}
                  onChange={changeAccountMarketplaceOrderBy}
                  options={MARKETPLACE_SORT_OPTIONS}
                  isClearable
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
            !fetchingCdps && !fetchingCdpsError && (
              <React.Fragment>
                {
                  cdpItems.length > 0 && (
                    <div className="cdp-list-wrapper">
                      { cdpItems.map(cdp => (<CdpBox data={cdp} key={cdp.id} />)) }
                    </div>
                  )
                }

                {
                  cdpItems.length === 0 && (
                    <div className="empty-page-wrapper">
                      <i className="icon-empty" />
                      <span>
                        {
                          cdps.length === 0 && (
                            'Put your CDP on sale, while your cdp is on sale you are still in control of the CDP'
                          )
                        }

                        {
                          cdps.length > 0 && (
                            'There are no matches the searched ID'
                          )
                        }
                      </span>
                    </div>
                  )
                }
              </React.Fragment>
            )
          }
        </div>
      </div>
    </div>
  );
};

MarketplacePage.propTypes = {
  account: PropTypes.string.isRequired,
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

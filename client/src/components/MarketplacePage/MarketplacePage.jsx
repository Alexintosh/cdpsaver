import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMarketplaceCdpsData } from '../../actions/marketplaceActions';

const MarketplacePage = ({ cdps, fetchingCdps, getMarketplaceCdpsData }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(async () => {
    if (!mounted) {
      getMarketplaceCdpsData();

      setMounted(true);
    }
  });

  return (
    <div>
      getMarketplaceCdpsData
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

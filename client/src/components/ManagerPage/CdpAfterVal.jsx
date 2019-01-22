import React from 'react';
import PropTypes from 'prop-types';

const CdpAfterVal = ({
  type, loading, cdp, cdpProp, symbol,
}) => (
  <div className={`after-value ${type}`}>
    { loading && 'Loading...' }
    {
      !loading && cdp && (
        <div className="amount-wrapper">
          <span className="after">After:</span>
          <span className="amount">{ cdp[cdpProp].toFixed(2) }{ symbol }</span>
        </div>
      )
    }
  </div>
);

CdpAfterVal.defaultProps = {
  cdp: null,
  symbol: '',
};

CdpAfterVal.propTypes = {
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  cdp: PropTypes.object,
  cdpProp: PropTypes.string.isRequired,
  symbol: PropTypes.string,
};

export default CdpAfterVal;

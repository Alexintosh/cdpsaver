import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../../utils/utils';
import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

const CdpAfterVal = ({
  type, loading, cdp, cdpProp, symbol,
}) => (
  <div className={`after-value ${type}`}>
    { loading && 'Loading...' }
    {
      !loading && cdp && (
        <div className="amount-wrapper">
          <span className="after">After:</span>
          <span className="amount">
            <TooltipWrapper title={cdp[cdpProp]}>
              { formatNumber(cdp[cdpProp], 2) }{ symbol }
            </TooltipWrapper>
          </span>
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

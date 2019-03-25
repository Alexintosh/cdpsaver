import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '../../utils/utils';
import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

const CdpAfterVal = ({
  type, loading, cdp, cdpProp, symbol,
}) => {
  let val = 0;
  let valLabel = 0;

  if (!loading && cdp) {
    val = cdp[cdpProp];
    valLabel = `${formatNumber(cdp[cdpProp], 2)}${symbol}`;

    if (val === 0 || val === Infinity) {
      val = '0';
      valLabel = '0';
    }
  }

  const repayDaiDebt = type === 'repay' && cdpProp === 'debtDai';

  return (
    <div className={`after-value ${type}`}>
      { loading && 'Loading...' }
      {
        !loading && cdp && (
          <div className="amount-wrapper">
            <span className="after">After:</span>
            <span className="amount">
              <TooltipWrapper title={val}>
                {((type === 'repay' || type === 'boost') && !repayDaiDebt) ? '~' : ''}{valLabel}
              </TooltipWrapper>
            </span>
          </div>
        )
      }
    </div>
  );
};

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

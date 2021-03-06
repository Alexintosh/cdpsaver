import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import InputComponent from '../../Forms/InputComponent';
import { formatNumber, notGraterThan } from '../../../utils/utils';
import InfoBox from '../../Decorative/InfoBox/InfoBox';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import { setAfterValue } from '../../../actions/dashboardActions';

const CdpAction = ({
  disabled,
  actionExecuting,
  setValToMax,
  maxVal,
  gettingMaxVal,
  afterType,
  type,
  setAfterValue,
  executingLabel,
  toExecuteLabel,
  info,
  name,
  id,
  symbol,
  executeAction,
  errorText,
  noMax,
}) => {
  const additional = { min: 0 };
  let normalizeFunc = val => val;

  if (!noMax) {
    additional.max = maxVal;
    normalizeFunc = val => notGraterThan(val, maxVal);
  }

  return (
    <div className={`item ${type}`}>
      {
        !noMax && (
          <div
            className={`max-wrapper ${actionExecuting ? 'loading' : ''}`}
            onClick={() => {
              if (!actionExecuting) setValToMax();
            }}
          >
            <TooltipWrapper title={maxVal}>
              { gettingMaxVal ? 'Loading...' : `(max ${formatNumber(maxVal, 2)})` }
            </TooltipWrapper>
          </div>
        )
      }

      <Field
        id={id}
        type="number"
        wrapperClassName={`form-item-wrapper ${type} ${afterType === type ? 'active' : ''}`}
        name={name}
        onChange={(e) => {
          const normVal = normalizeFunc(e.target.value);

          if (noMax) setAfterValue(normVal, type);
          if (!noMax && (normVal <= maxVal)) setAfterValue(normVal, type);
        }}
        labelText={`${toExecuteLabel}:`}
        secondLabelText={symbol}
        placeholder="0"
        normalize={normalizeFunc}
        additional={additional}
        disabled={actionExecuting}
        component={InputComponent}
      />

      <div className="item-button-wrapper">
        <InfoBox message={info} />

        <Tooltip title={errorText} disabled={!disabled}>
          <button
            type="button"
            className="button gray uppercase"
            onClick={() => { executeAction(); }}
            disabled={disabled}
          >
            { actionExecuting ? executingLabel : toExecuteLabel }
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

CdpAction.defaultProps = {
  disabled: false,
  errorText: '',
  noMax: false,
};

CdpAction.propTypes = {
  actionExecuting: PropTypes.bool.isRequired,
  setValToMax: PropTypes.func.isRequired,
  maxVal: PropTypes.number.isRequired,
  gettingMaxVal: PropTypes.bool.isRequired,
  afterType: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setAfterValue: PropTypes.func.isRequired,
  executingLabel: PropTypes.string.isRequired,
  toExecuteLabel: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  executeAction: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  noMax: PropTypes.bool,
  errorText: PropTypes.string,
};

const mapStateToProps = state => ({
  afterType: state.dashboard.afterType,
});

const mapDispatchToProps = { setAfterValue };

export default connect(mapStateToProps, mapDispatchToProps)(CdpAction);

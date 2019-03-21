import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { changeSelectedCdp } from '../../actions/generalActions';

import './CdpSelect.scss';

const CdpSelect = ({
  cdps, cdp, changeSelectedCdp, labelText, customCdps, additionalClasses,
}) => {
  const cdpsArray = customCdps.length > 0 ? customCdps : cdps;
  const value = { label: cdp.id, value: cdp.id };
  const options = cdpsArray.map(_cdp => ({ label: _cdp.id, value: _cdp.id }));

  return (
    <div className={`cdp-select-wrapper ${additionalClasses}`}>
      <div className="label">{ labelText }</div>

      <Select
        className="select main-select main-select-small"
        classNamePrefix="select"
        value={value}
        onChange={changeSelectedCdp}
        options={options}
      />
    </div>
  );
};

CdpSelect.defaultProps = {
  labelText: 'Current CDP ID:',
  customCdps: [],
  additionalClasses: '',
};

CdpSelect.propTypes = {
  cdps: PropTypes.array.isRequired,
  cdp: PropTypes.object.isRequired,
  changeSelectedCdp: PropTypes.func.isRequired,
  customCdps: PropTypes.array,
  labelText: PropTypes.string,
  additionalClasses: PropTypes.string,
};

const mapStateToProps = ({ general }) => ({
  cdps: general.cdps,
  cdp: general.cdp,
});

const mapDispatchToProps = {
  changeSelectedCdp,
};

export default connect(mapStateToProps, mapDispatchToProps)(CdpSelect);

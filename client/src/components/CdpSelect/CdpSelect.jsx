import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { changeSelectedCdp } from '../../actions/generalActions';

import './CdpSelect.scss';

const CdpSelect = ({ cdps, cdp, changeSelectedCdp }) => {
  const value = { label: cdp.id, value: cdp.id };
  const options = cdps.map(_cdp => ({ label: _cdp.id, value: _cdp.id }));

  return (
    <div className="cdp-select-wrapper">
      <div className="label">Current CDP ID:</div>

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

CdpSelect.propTypes = {
  cdps: PropTypes.array.isRequired,
  cdp: PropTypes.object.isRequired,
  changeSelectedCdp: PropTypes.func.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdps: general.cdps,
  cdp: general.cdp,
});

const mapDispatchToProps = {
  changeSelectedCdp,
};

export default connect(mapStateToProps, mapDispatchToProps)(CdpSelect);

import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';

import './InfoBox.scss';

const InfoBox = ({ message }) => (
  <Tooltip title={message}>
    <div className="info-box-wrapper">
      <i className="icon-Info-circle" />
    </div>
  </Tooltip>
);

InfoBox.defaultProps = {
  message: '',
};

InfoBox.propTypes = {
  message: PropTypes.string,
};

export default InfoBox;

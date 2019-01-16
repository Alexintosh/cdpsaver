import React from 'react';
import PropTypes from 'prop-types';

import './Loader.scss';

const Loader = ({ message }) => (
  <div className="loader-wrapper">
    <div className="loader">
      <div className="loader-text">Loading...</div>
      <svg className="circular" viewBox="25 25 50 50">
        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
      </svg>
    </div>

    { message && (<div className="message-wrapper">{ message }</div>) }
  </div>
);

Loader.defaultProps = {
  message: '',
};

Loader.propTypes = {
  message: PropTypes.string,
};

export default Loader;

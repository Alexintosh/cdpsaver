import React from 'react';

import './SwitchToDesktop.scss';

const SwitchToDesktop = () => (
  <div className="switch-to-desktop-wrapper">
    <div className="content-wrapper">
      <div className="message-wrapper">
        <i className="icon-desktop" />

        <div className="title">CDP Saver doesn’t support mobile browsers yet</div>

        <div className="message">
          Support for mobile devices will be implemented soon, but until then please switch to your desktop or
          laptop for the best experience.
        </div>
      </div>
    </div>
  </div>
);

SwitchToDesktop.propTypes = {};

export default SwitchToDesktop;

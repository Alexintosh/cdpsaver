import React from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';

const Header = () => (
  <div
    className={`
      header-wrapper
      ${window.location.pathname === '/' ? 'homepage' : ''}
      ${window.location.pathname.includes('onboarding') ? 'onboarding' : ''}
    `}
  >
    <div className="width-container">
      <Link className="logo-wrapper" to="/">
        <span>CDP</span>
        Saver
      </Link>

      <div className="links-wrapper">
        <Link to="/dashboard/marketplace">Marketplace</Link>
        <Link to="/onboarding">Onboarding</Link>
        <Link to="/dashboard/monitoring">Monitoring</Link>
        <Link to="/dashboard/saver">Saver</Link>
        <Link to="/onboarding/wizard">Onboarding wizard</Link>
      </div>
    </div>
  </div>
);

Header.propTypes = {};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';

const Header = () => (
  <div className="header-wrapper">
    <div className="width-container">
      <Link className="logo-wrapper" to="/">
        <span>CDP</span>
        Saver
      </Link>

      <div className="links-wrapper">
        <Link to="/onboarding">Onboarding</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/monitoring">Monitoring</Link>
        <Link to="/saver">Saver</Link>
      </div>
    </div>
  </div>
);

Header.propTypes = {};

export default Header;

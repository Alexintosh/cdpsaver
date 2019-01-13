import React from 'react';
import { Link, NavLink } from 'react-router-dom';

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
        <NavLink activeClassName="active" to="/marketplace">Marketplace</NavLink>
        <NavLink activeClassName="active" to="/onboarding">Onboarding</NavLink>
        <NavLink activeClassName="active" to="/dashboard/manage">Manage</NavLink>
        <NavLink activeClassName="active" to="/dashboard/monitoring">Monitoring</NavLink>
        <NavLink activeClassName="active" to="/dashboard/saver">Saver</NavLink>
        <NavLink activeClassName="active" to="/onboarding/wizard">Onboarding wizard</NavLink>
      </div>
    </div>
  </div>
);

Header.propTypes = {};

export default Header;

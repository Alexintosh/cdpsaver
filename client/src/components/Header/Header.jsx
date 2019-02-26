import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import './Header.scss';

const Header = () => (
  <div className="header-wrapper">
    <div className="width-container">
      <Link className="logo-wrapper" to="/">
        <span>CDP</span>
        Saver
      </Link>

      <div className="links-wrapper">
        <NavLink activeClassName="active" to="/marketplace">Marketplace</NavLink>
        <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>
      </div>
    </div>
  </div>
);

Header.propTypes = {};

export default Header;

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { isMobileDevice } from '../../utils/utils';

import './Header.scss';
import logo from './logo.svg';

const Header = () => {
  const absoluteHeader = window.location.pathname === '/' || window.location.pathname === '/terms-of-service';
  const mobileAbsolute = !absoluteHeader && isMobileDevice();

  return (
    <div className={`header-wrapper ${(absoluteHeader || mobileAbsolute) && 'absolute-header'}`}>
      <div className="width-container">
        <Link className="logo-wrapper" to="/"><img src={logo} alt="logo" /></Link>

        {
          absoluteHeader && (
            <div className="links-wrapper">
              <NavLink activeClassName="active" to="/connect">Connect wallet</NavLink>
              <NavLink activeClassName="active" to="/marketplace">Marketplace</NavLink>
              <NavLink activeClassName="active" to="/create-cdp">Create CDP</NavLink>
              <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink>
            </div>
          )
        }
      </div>
    </div>
  );
};

Header.propTypes = {};

export default Header;

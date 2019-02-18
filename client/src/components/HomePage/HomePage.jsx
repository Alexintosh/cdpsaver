import React from 'react';
import { Link } from 'react-router-dom';

import './HomePage.scss';
import sectionBg from './sectionBg.png';

const HomePage = () => (
  <div className="homepage-wrapper">

    <div className="section first-section">

      <img src={sectionBg} className="first-section-bg" alt="background" />

      <div className="width-container">
        <div className="section-title">
          What is
          <span>CDP</span>
          Saver
        </div>

        <div className="section-text">
        CDP Saver is a web application that aims to help users in protecting their CDPs from liquidation.
        By providing advanced features through are dashboard, users are able to better manage and protect theri CDPs.
        </div>

        <Link to="/dashboard" className="button green">Get Started</Link>
      </div>
    </div>

    <div className="section features-section">
      <div className="width-container">
        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-laptop-gear" />
          </div>

          <div className="section-title">Dashboard</div>

          <div className="section-text">
            An easy to use dashboard, which provides advanced features like Repay and Boost.
          </div>
        </div>

        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-laptop-gear" />
          </div>

          <div className="section-title">Marketplace</div>

          <div className="section-text">
            Buy and sell other users CDPs at discount prices and save them from liquidation.
          </div>
        </div>

        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-laptop-gear" />
          </div>

          <div className="section-title">Saver</div>

          <div className="section-text">
            By providing constant monitoring, keep your CDP at a certain ratio level and avoid liquidation.
          </div>
        </div>
      </div>
    </div>
  </div>
);

HomePage.propTypes = {};

export default HomePage;

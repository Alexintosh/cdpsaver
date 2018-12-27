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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat.
        </div>

        <Link to="/dashboard" className="button green">Start monitoring</Link>
      </div>
    </div>

    <div className="section features-section">
      <div className="width-container">
        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-laptop-gear" />
          </div>

          <div className="section-title">Marketplace</div>

          <div className="section-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </div>
        </div>

        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-laptop-gear" />
          </div>

          <div className="section-title">Monitoring</div>

          <div className="section-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </div>
        </div>

        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-laptop-gear" />
          </div>

          <div className="section-title">Saver</div>

          <div className="section-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
      </div>
    </div>
  </div>
);

HomePage.propTypes = {};

export default HomePage;

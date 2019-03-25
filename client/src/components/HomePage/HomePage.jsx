import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { openContactUsModal } from '../../actions/modalActions';

import './HomePage.scss';
import sectionBg from './sectionBg.png';
import decenterLogo from './decenter-logo.png';

const HomePage = ({ openContactUsModal }) => (
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
        CDP Saver is a web application that aims to help users protect their CDPs from liquidation.
        Using advanced features through our dashboard, users are able to better manage and protect their CDPs.
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
          An easy to use Dashboard that includes advanced features such as Repay and Boost.
          </div>
        </div>

        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-squares" />
          </div>

          <div className="section-title">Marketplace</div>

          <div className="section-text">
          A place to sell yours or buy other users&apos; CDPs at discount prices and save them from liquidation.
          </div>
        </div>

        <div className="section-box">
          <div className="section-box-icon-wrapper">
            <i className="icon-life-saver" />
          </div>

          <div className="section-title">Saver</div>

          <div className="section-text">
          An automated tool to keep your CDP at a certain ratio level and avoid liquidation.
          </div>
        </div>
      </div>
    </div>

    <div className="footer">
      <div className="decenter-wrapper">
        <div>Developed by</div>
        <img src={decenterLogo} alt="Decenter logo" />
        <div>© 2019 Decenter</div>
        <div>All rights reserved</div>
      </div>

      <div className="contact-link" onClick={openContactUsModal}>Contact us</div>
    </div>
  </div>
);

HomePage.propTypes = {
  openContactUsModal: PropTypes.func.isRequired,
};

const mapDispatchToProps = { openContactUsModal };

export default connect(null, mapDispatchToProps)(HomePage);

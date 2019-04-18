import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { openContactUsModal } from '../../actions/modalActions';

import './Footer.scss';

const Footer = ({ openContactUsModal }) => (
  <div className="footer-wrapper">
    <div className="developed">
      <div className="label">Developed by</div>
      <div className="row">@ 2019 Decenter. <br/> All rights reserved.</div>
    </div>

    <a target="_blank" rel="noopener noreferrer" href="https://decenter.com/">
      <div className="logo" />
    </a>

    <div className="links-wrapper">
      <div className="link" onClick={openContactUsModal}>Contact us</div>
      <Link to="/terms-of-service" className="link">Terms of service</Link>
    </div>
  </div>
);

Footer.propTypes = {
  openContactUsModal: PropTypes.func.isRequired,
};

const mapDispatchToProps = { openContactUsModal };

export default connect(null, mapDispatchToProps)(Footer);

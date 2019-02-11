import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './MigratePage.scss';

const MigratePage = ({ cdp, account }) => {
  if (cdp.owner !== account) return (<Redirect to="/dashboard/manage" />);

  return (
    <div className="migrate-page-wrapper dashboard-page-wrapper">
      <div className="sub-heading-wrapper">
        <div className="width-container">
          <div className="sub-title">Migrate</div>
          <div className="sub-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="width-container">
          <div className="main-section-wrapper">
            <div className="content-title">Migrate CDP #{cdp.id}</div>

            <div className="content-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu
              pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
              Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam.
            </div>

            <button type="button" className="button green uppercase">Migrate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

MigratePage.propTypes = {
  // history: PropTypes.object.isRequired,
  cdp: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
  account: general.account,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MigratePage);

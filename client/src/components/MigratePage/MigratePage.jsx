import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { migrateCdpAction, resetMigrateCdp } from '../../actions/migrateActions';

import './MigratePage.scss';

class MigratePage extends Component {
  componentWillUnmount() {
    this.props.resetMigrateCdp();
  }

  render() {
    const {
      cdp, account, migrating, migratingError, migrateCdpAction,
    } = this.props;

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

              { migratingError && <div className="content-error">{ migratingError }</div> }

              <button
                type="button"
                className="button green uppercase"
                disabled={migrating}
                onClick={() => { migrateCdpAction(cdp); }}
              >
                { migrating ? 'Migrating' : 'Migrate' }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MigratePage.propTypes = {
  cdp: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  migrateCdpAction: PropTypes.func.isRequired,
  resetMigrateCdp: PropTypes.func.isRequired,
  migrating: PropTypes.bool.isRequired,
  migratingError: PropTypes.string.isRequired,
};

const mapStateToProps = ({ general, migrate }) => ({
  cdp: general.cdp,
  account: general.account,
  migrating: migrate.migrating,
  migratingError: migrate.migratingError,
});

const mapDispatchToProps = { migrateCdpAction, resetMigrateCdp };

export default connect(mapStateToProps, mapDispatchToProps)(MigratePage);

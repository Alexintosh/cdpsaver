import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { formatAcc, formatAccType } from '../../utils/utils';

const DashboardSubHeader = ({
  cdp, accountType, account, network,
}) => (
  <div className="sub-heading-wrapper">
    <div className="width-container">
      <div className="left links-wrapper">
        <NavLink activeClassName="active" to="/dashboard/manage">Manage</NavLink>
        <NavLink activeClassName="active" to="/dashboard/saver">Saver</NavLink>
        <NavLink activeClassName="active" to="/dashboard/monitoring">Monitoring</NavLink>
        <NavLink activeClassName="active" to="/dashboard/saver">Saver</NavLink>
      </div>

      <div className="right">
        <div className="sub-title with-label">
          <div className="label">CDP ID:</div>
          <div className="value">#{ cdp.id }</div>
        </div>

        <div className="account-wrapper">
          <div className="acc-type">{ formatAccType(accountType) }</div>
          <div className="connected">Connected:</div>

          <a
            target="_blank"
            rel="noopener noreferrer"
            className="acc"
            href={`https://${network === 42 ? 'kovan.' : ''}etherscan.io/address/${account}`}
          >
            <Tooltip title={account}>
              { formatAcc(account) }
            </Tooltip>
          </a>
        </div>
      </div>
    </div>
  </div>
);

DashboardSubHeader.propTypes = {
  cdp: PropTypes.object.isRequired,
  accountType: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  network: PropTypes.number.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
  accountType: general.accountType,
  account: general.account,
  network: general.network,
});

export default withRouter(connect(mapStateToProps)(DashboardSubHeader));

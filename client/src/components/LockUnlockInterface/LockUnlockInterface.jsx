import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { approveDaiAction, approveMakerAction } from '../../actions/dashboardActions';

import './LockUnlockInterface.scss';

const LockUnlockInterface = ({
  daiUnlocked, makerUnlocked, daiBalance, makerBalance, approveDaiAction, approveMakerAction,
  approvingDai, approvingDaiError, approvingMaker, approvingMakerError,
}) => (
  <div className="lock-unlock-interface-wrapper">
    <div className="lock-header">
      <div className="header-item">Name</div>
      <div className="header-item"> Balance</div>
    </div>

    <div className="lock-item">
      <div className="currency">DAI</div>

      <div className="balance">{ daiBalance.toFixed(2) }</div>

      {
        !approvingDai && daiUnlocked && (
          <div className="approved">
            <span>Approved</span>
            <i className="icon-success-circle" />
          </div>
        )
      }

      {
        (approvingDai || !daiUnlocked) && (
          <button
            type="button"
            disabled={approvingDai}
            className={`button ${approvingDai ? 'gray' : 'green'} uppercase`}
            onClick={approveDaiAction}
          >
            { approvingDai && 'Approving' }
            { !approvingDai && !daiUnlocked && 'Approve' }
          </button>
        )
      }
    </div>

    { !approvingDai && approvingDaiError && (<div className="lock-item-error dai">{ approvingDaiError }</div>) }

    <div className="lock-item">
      <div className="currency">MKR</div>

      <div className="balance">{ makerBalance.toFixed(2) }</div>

      {
        !approvingMaker && makerUnlocked && (
          <div className="approved">
            <span>Approved</span>
            <i className="icon-success-circle" />
          </div>
        )
      }

      {
        (approvingMaker || !makerUnlocked) && (
          <button
            type="button"
            disabled={approvingMaker}
            className={`button ${approvingMaker ? 'gray' : 'green'} uppercase`}
            onClick={approveMakerAction}
          >
            { approvingMaker && 'Approving' }
            { !approvingMaker && !makerUnlocked && 'Approve' }
          </button>
        )
      }
    </div>

    { !approvingMaker && approvingMakerError && (<div className="lock-item-error maker">{ approvingMakerError }</div>) }
  </div>
);

LockUnlockInterface.propTypes = {
  daiUnlocked: PropTypes.bool.isRequired,
  makerUnlocked: PropTypes.bool.isRequired,
  daiBalance: PropTypes.number.isRequired,
  makerBalance: PropTypes.number.isRequired,
  approveDaiAction: PropTypes.func.isRequired,
  approveMakerAction: PropTypes.func.isRequired,
  approvingDai: PropTypes.bool.isRequired,
  approvingDaiError: PropTypes.string.isRequired,
  approvingMaker: PropTypes.bool.isRequired,
  approvingMakerError: PropTypes.string.isRequired,
};

const mapStateToProps = ({ general, dashboard }) => ({
  daiUnlocked: general.daiUnlocked,
  makerUnlocked: general.makerUnlocked,
  daiBalance: general.daiBalance,
  makerBalance: general.makerBalance,
  approvingDai: dashboard.approvingDai,
  approvingDaiError: dashboard.approvingDaiError,
  approvingMaker: dashboard.approvingMaker,
  approvingMakerError: dashboard.approvingMakerError,
});

const mapDispatchToProps = {
  approveDaiAction, approveMakerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(LockUnlockInterface);

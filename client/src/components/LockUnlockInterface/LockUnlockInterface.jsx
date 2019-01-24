import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './LockUnlockInterface.scss';

const LockUnlockInterface = ({
  daiUnlocked, makerUnlocked, daiBalance, makerBalance,
}) => (
  <div className="lock-unlock-interface-wrapper">
    <div className="lock-header">
      <div className="header-item">Name</div>
      <div className="header-item"> Balance</div>
    </div>

    <div className="lock-item">
      <div className="currency">DAI</div>

      <div className="balance">{ daiBalance.toFixed(2) }</div>

      <button type="button" className={`button ${daiUnlocked ? 'green' : 'gray'} uppercase`}>
        { daiUnlocked ? 'Approved' : 'Approve' }
      </button>
    </div>

    <div className="lock-item">
      <div className="currency">MKR</div>

      <div className="balance">{ makerBalance.toFixed(2) }</div>

      <button type="button" className={`button ${makerUnlocked ? 'green' : 'gray'} uppercase`}>
        { makerUnlocked ? 'Approved' : 'Approve' }
      </button>
    </div>
  </div>
);

LockUnlockInterface.propTypes = {
  daiUnlocked: PropTypes.bool.isRequired,
  makerUnlocked: PropTypes.bool.isRequired,
  daiBalance: PropTypes.number.isRequired,
  makerBalance: PropTypes.number.isRequired,
};

const mapStateToProps = ({ general }) => ({
  daiUnlocked: general.daiUnlocked,
  makerUnlocked: general.makerUnlocked,
  daiBalance: general.daiBalance,
  makerBalance: general.makerBalance,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LockUnlockInterface);

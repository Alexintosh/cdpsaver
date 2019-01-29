import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseIcon from '../Decorative/CloseIcon';
import TxErrorIcon from '../Decorative/TxErrorIcon';
import TxSuccessIcon from '../Decorative/TxSuccessIcon';
import Loader from '../Loader/Loader';
import { closeNotification } from '../../actions/notificationsActions';

import './TxNotifications.scss';

const TxNotifications = ({ notifications, closeNotification }) => (
  <div className="tx-notifications-wrapper">
    {
      notifications.map(({
        id, title, description, type, tx,
      }) => (
        <div className={`single-notification ${type} ${tx ? 'has-tx' : ''}`} key={id}>
          <span onClick={() => { closeNotification(id); }}><CloseIcon size={12} /></span>

          <div className="content">
            <span className="status-wrapper">
              { type === 'error' && (<TxErrorIcon />) }
              { type === 'success' && (<TxSuccessIcon />) }
              { type === 'loading' && (<Loader showDefaultMessage={false} />) }
            </span>

            <div className="info-wrapper">
              <div className="title">{ title }</div>
              <div className="description">{ description }</div>
            </div>
          </div>
        </div>
      ))
    }
  </div>
);

TxNotifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  closeNotification: PropTypes.func.isRequired,
};

const mapStateToProps = ({ notifications }) => ({
  notifications: notifications.notifications,
});

const mapDispatchToProps = {
  closeNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(TxNotifications);

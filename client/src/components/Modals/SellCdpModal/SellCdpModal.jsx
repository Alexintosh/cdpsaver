import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalBody from '../ModalBody';
import ModalHeader from '../ModalHeader';

import './SellCdpModal.scss';

const SellCdpModal = ({ closeModal }) => (
  <div className="sell-cdp-modal-wrapper">
    <ModalHeader closeModal={closeModal} actionHeader actionText="Approve" />

    <ModalBody>
      <h3 className="title">Put on sale</h3>
    </ModalBody>

    <div className="modal-controls">
      <button type="button" className="button green uppercase" onClick={() => {}}>
        Sell
      </button>
    </div>
  </div>
);

SellCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

// const mapDispatchToProps = {
//   adminApproveMedia,
// };

export default connect(mapStateToProps)(SellCdpModal);

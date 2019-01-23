import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ModalHeader from '../ModalHeader';
import { getCloseData } from '../../../services/cdpService';

class CloseCdpModal extends Component {
  componentWillMount() {
    this.props.getCloseData();
  }

  render() {
    const { closeModal } = this.props;

    return (
      <div className="sell-cdp-modal-wrapper">
        <ModalHeader closeModal={closeModal} actionHeader actionText="Close" />

      </div>
    );
  }
}

CloseCdpModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  getCloseData: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  getCloseData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseCdpModal);

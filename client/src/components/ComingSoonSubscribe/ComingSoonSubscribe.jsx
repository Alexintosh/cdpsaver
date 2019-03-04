import React, { Component } from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import ComingSoonSubscribeForm from './ComingSoonSubscribeForm/ComingSoonSubscribeForm';
import { resetSubscribeComingSoon } from '../../actions/generalActions';

import './ComingSoonSubscribe.scss';

class ComingSoonSubscribe extends Component {
  componentWillUnmount() {
    this.props.resetSubscribeComingSoon();
  }

  render() {
    const { title, submittingFormSuccess } = this.props;

    return (
      <div className="coming-soon-subscribe-wrapper">
        <div className="title">{title} feature coming soon</div>

        <div className="description">
          What is the overall collateral ratio of the system (lowest, higest point of the week) How much dai is in the
          system,How much dai is in the system,
        </div>

        { !submittingFormSuccess && <ComingSoonSubscribeForm /> }
        {
          submittingFormSuccess && (
            <div className="success">
              Thanks for subscribing! We will notify you as soon as this feature goes live.
            </div>
          )
        }
      </div>
    );
  }
}

ComingSoonSubscribe.defaultProps = {
  title: '',
};

ComingSoonSubscribe.propTypes = {
  title: PropType.string,
  resetSubscribeComingSoon: PropType.func.isRequired,
  submittingFormSuccess: PropType.bool.isRequired,
};

const mapStateToProps = ({ general }) => ({
  submittingFormSuccess: general.subscribingComingSoonSuccess,
});

const mapDispatchToProps = {
  resetSubscribeComingSoon,
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoonSubscribe);

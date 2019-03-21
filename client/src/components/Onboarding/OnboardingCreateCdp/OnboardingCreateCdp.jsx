import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import OnboardingWizardCreateCdpForm from './OnboardingCreateCdpForm/OnboardingCreateCdpForm';

import './OnboardingCreateCdp.scss';

let OnboardingCreateCdp = ({
  pristine, invalid, submittingForm, history, ratio,
}) => (
  <div className="onboarding-create-cdp-wrapper onboarding-page-wrapper">
    <div className="onboarding-content-bg">
      <div className="onboarding-content-wrapper no-margin width-container">

        <div className="content-heading">
          Create
          <span>CDP</span>
        </div>
        <div className="content-text">
          Creating a CDP allows you to generate Dai by providing collateral in ETH
        </div>

        <OnboardingWizardCreateCdpForm history={history} />
      </div>

      <div className="bottom-controls width-container">
        <button
          type="submit"
          disabled={pristine || invalid || submittingForm || ratio < 150}
          className="button green uppercase"
          form="onboarding-create-cdp-form"
        >
          { submittingForm ? 'Creating' : 'Create' }
        </button>
      </div>
    </div>
  </div>
);

OnboardingCreateCdp.propTypes = {
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submittingForm: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  ratio: PropTypes.number.isRequired,
};

OnboardingCreateCdp = reduxForm({
  form: 'onboardingCreateCdpForm',
})(OnboardingCreateCdp);

const mapStateToProps = ({ onboarding }) => ({
  submittingForm: onboarding.creatingCdp,
  cdpFormSubmitted: onboarding.cdpFormSubmitted,
  ratio: parseFloat(onboarding.newCdpRatio),
});

export default connect(mapStateToProps)(OnboardingCreateCdp);

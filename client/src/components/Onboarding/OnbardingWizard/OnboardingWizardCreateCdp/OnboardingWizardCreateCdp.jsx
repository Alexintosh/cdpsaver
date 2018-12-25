import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import OnboardingWizardCreateCdpForm from './OnboardingWizardCreateCdpForm/OnboardingWizardCreateCdpForm';

import './OnboardingWizardCreateCdp.scss';

let OnboardingWizardCreateCdp = ({
  hasCdp, pristine, invalid, submittingForm, history, cdpFormSubmitted,
}) => {
  if (hasCdp || cdpFormSubmitted) return (<Redirect to="/onboarding/wizard/info" />);

  return (
    <div className="onboarding-wizard-create-cdp-wrapper onboarding-page-wrapper">
      <div className="onboarding-content-bg">
        <div className="onboarding-content-wrapper no-margin width-container">

          <div className="content-heading">
            Create
            <span>CDP</span>
          </div>
          <div className="connect-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          </div>

          <OnboardingWizardCreateCdpForm history={history} />
        </div>

        <div className="onboardin-controls width-container">
          <div className="info-text">If you have a cdp and we didn&apos;t detect it, contact us</div>
          <button
            type="submit"
            disabled={pristine || invalid || submittingForm}
            className="button green uppercase"
            form="onboarding-wizard-create-cdp-form"
          >
            { submittingForm ? 'Creating' : 'Create' }
          </button>
        </div>
      </div>
    </div>
  );
};

OnboardingWizardCreateCdp.propTypes = {
  hasCdp: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submittingForm: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  cdpFormSubmitted: PropTypes.bool.isRequired,
};

OnboardingWizardCreateCdp = reduxForm({
  form: 'onboardingWizardCreateCdpForm',
})(OnboardingWizardCreateCdp);

const mapStateToProps = ({ onboarding }) => ({
  submittingForm: onboarding.creatingCdp,
  cdpFormSubmitted: onboarding.cdpFormSubmitted,
});

export default connect(mapStateToProps)(OnboardingWizardCreateCdp);

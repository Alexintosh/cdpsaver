import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Slider from 'rc-slider';
import onboardingWizardCreateCdpFormValidator from './onboardingWizardCreateCdpFormValidator';
import InputComponent from '../../../../Forms/InputComponent';
import { createCdpAction } from '../../../../../actions/onboardingActions';
import { getRainbowSliderValColor } from '../../../../../utils/utils';

import '../../../../../common/slider.scss';

class OnboardingWizardCreateCdpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: '',
    };

    this.sliderWidth = 284;
    this.gradients = [
      [0, [255, 0, 0]],
      [49, [255, 141, 0]],
      [100, [72, 189, 0]],
    ];

    this.handleSliderValChange = this.handleSliderValChange.bind(this);
  }

  componentDidMount() {
    // CHANGE THIS IF THERE WILL BE A DIFFERENT DEFAULT SLIDER VALUE
    this.handleSliderValChange(1);
  }

  handleSliderValChange(val) {
    const rbgArray = getRainbowSliderValColor(val, this.gradients, this.sliderWidth);
    this.setState({ currentColor: `rgb(${rbgArray.join(',')})` });
  }

  render() {
    const { handleSubmit, onSubmit, history } = this.props;

    return (
      <form
        id="onboarding-wizard-create-cdp-form"
        onSubmit={handleSubmit((e) => { onSubmit(e, history); })}
        className="form-wrapper"
      >
        <Field
          id="onboarding-create-cdp-eth-amount"
          name="ethAmount"
          placeholder="1"
          type="number"
          labelText="Amount of ETH:"
          secondLabelText="ETH"
          additional={{ min: 1 }}
          component={InputComponent}
          showErrorText
          focus
        />

        <Field
          id="onboarding-create-cdp-dai-amount"
          name="daiAmount"
          placeholder="1"
          type="number"
          labelText="Amount of DAI:"
          secondLabelText="DAI"
          additional={{ min: 1 }}
          component={InputComponent}
          showErrorText
        />
        <div className="slider-wrapper">
          <Slider
            ref={this.slider}
            onChange={this.handleSliderValChange}
            handleStyle={{ backgroundColor: this.state.currentColor }}
            min={1}
            max={100}
          />

          <div className="liquidation">
            <div className="label">Liquidation price:</div>
            <div
              style={{ color: this.state.currentColor }}
              className="value"
            >
              40%
            </div>
          </div>
        </div>
      </form>
    );
  }
}

OnboardingWizardCreateCdpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const OnboardingWizardCreateCdpFormComp = reduxForm({
  form: 'onboardingWizardCreateCdpForm',
  validate: onboardingWizardCreateCdpFormValidator,
})(OnboardingWizardCreateCdpForm);

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: createCdpAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardCreateCdpFormComp);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Slider from 'rc-slider';
import onboardingCreateCdpFormFormValidator from './onboardingCreateCdpFormFormValidator';
import InputComponent from '../../../Forms/InputComponent';
import { createCdpAction } from '../../../../actions/onboardingActions';
import { getRainbowSliderValColor } from '../../../../utils/utils';

import '../../../../common/slider.scss';

class OnboardingCreateCdpForm extends Component {
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
        id="onboarding-create-cdp-form"
        onSubmit={handleSubmit((e) => { onSubmit(e, history); })}
        className="form-wrapper"
      >
        <Field
          id="onboarding-create-cdp-eth-amount"
          name="ethAmount"
          placeholder="1"
          type="number"
          labelText="Add collateral:"
          secondLabelText="ETH"
          component={InputComponent}
          showErrorText
          focus
        />

        <Field
          id="onboarding-create-cdp-dai-amount"
          name="daiAmount"
          placeholder="1"
          type="number"
          labelText="Generate DAI:"
          secondLabelText="DAI"
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

OnboardingCreateCdpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const OnboardingWizardCreateCdpFormComp = reduxForm({
  form: 'onboardingCreateCdpForm',
  validate: onboardingCreateCdpFormFormValidator,
})(OnboardingCreateCdpForm);

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: createCdpAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardCreateCdpFormComp);

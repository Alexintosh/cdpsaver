import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import onboardingCreateCdpFormFormValidator from './onboardingCreateCdpFormFormValidator';
import InputComponent from '../../../Forms/InputComponent';
import { createCdpAction, handleCreateCdpInputChange } from '../../../../actions/onboardingActions';
import { formatNumber, getRainbowSliderValColor } from '../../../../utils/utils';
import TooltipWrapper from '../../../TooltipWrapper/TooltipWrapper';

class OnboardingCreateCdpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: '',
    };

    this.gradients = [
      [0, [255, 0, 0]],
      [49, [255, 141, 0]],
      [100, [72, 189, 0]],
    ];

    this.handleSliderValChange = this.handleSliderValChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { formValues, ratio } = newProps;
    const { ethAmount, daiAmount } = formValues;

    if ((ethAmount && ethAmount > 0) && (daiAmount && daiAmount > 0)) this.handleSliderValChange(ratio);
  }

  handleSliderValChange(_ratio) {
    let ratio = _ratio;
    if (_ratio < 150) ratio = 150;
    if (_ratio > 450) ratio = 250;

    let val = 1 + ((ratio - 150) / (100 / 99));

    if (val > 100) val = 100;

    const rbgArray = getRainbowSliderValColor(val, this.gradients, 250);
    this.setState({ currentColor: `rgb(${rbgArray.join(',')})` });
  }

  render() {
    const {
      handleSubmit, onSubmit, history, formValues, ethPrice,
      handleCreateCdpInputChange,
    } = this.props;
    const ethAmount = parseFloat(formValues.ethAmount);
    const daiAmount = parseFloat(formValues.daiAmount);
    const ratio = parseFloat(this.props.ratio);
    const liquidationPrice = parseFloat(this.props.liquidationPrice);

    return (
      <form
        id="onboarding-create-cdp-form"
        onSubmit={handleSubmit((e) => { onSubmit(e, history); })}
        className="form-wrapper"
      >
        <Field
          id="onboarding-create-cdp-eth-amount"
          name="ethAmount"
          placeholder="0"
          type="number"
          labelText="Add collateral:"
          onChange={(e) => { handleCreateCdpInputChange(e.target.value, daiAmount, ethPrice); }}
          secondLabelText="ETH"
          component={InputComponent}
          showErrorText
          focus
        />

        <Field
          id="onboarding-create-cdp-dai-amount"
          name="daiAmount"
          placeholder="0"
          type="number"
          labelText="Generate DAI:"
          secondLabelText="DAI"
          onChange={(e) => { handleCreateCdpInputChange(ethAmount, e.target.value, ethPrice); }}
          component={InputComponent}
          showErrorText
        />
        <div className="new-stats-wrapper">
          <div className="stat-wrapper">
            <div className="label">Ratio:</div>
            <div
              style={{ color: this.state.currentColor }}
              className="value"
            >
              {
                ratio > 0 && (
                  <TooltipWrapper title={ratio}>
                    { formatNumber(ratio, 2) }%
                  </TooltipWrapper>
                )
              }

              { !ratio && <span id="temp1">-</span> }
            </div>
          </div>

          <div className="stat-wrapper">
            <div className="label">Liquidation price:</div>
            <div className="value">
              {
                (liquidationPrice > 0) && (
                  <TooltipWrapper title={liquidationPrice}>
                    { formatNumber(liquidationPrice, 2) }$
                  </TooltipWrapper>
                )
              }

              { !liquidationPrice && <span id="temp2">-</span> }
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
  handleCreateCdpInputChange: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  ethPrice: PropTypes.number.isRequired,
  liquidationPrice: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
};

const OnboardingWizardCreateCdpFormComp = reduxForm({
  form: 'onboardingCreateCdpForm',
  validate: onboardingCreateCdpFormFormValidator,
})(OnboardingCreateCdpForm);

const selector = formValueSelector('onboardingCreateCdpForm');

const mapStateToProps = state => ({
  formValues: {
    ethAmount: selector(state, 'ethAmount'),
    daiAmount: selector(state, 'daiAmount'),
  },
  ethPrice: state.general.ethPrice,
  liquidationPrice: state.onboarding.newCdpLiquidationPrice,
  ratio: state.onboarding.newCdpRatio,
});

const mapDispatchToProps = {
  onSubmit: createCdpAction,
  handleCreateCdpInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizardCreateCdpFormComp);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PieChart from '../PieChart/PieChart';
import Tabs from '../Tabs/Tabs';
import DaiIcon from '../Decorative/DaiIcon';
import EthIcon from '../Decorative/EthIcon';
import MkrIcon from '../Decorative/MkrIcon';
import ManagerBorrowForm from './ManagerBorrowForm/ManagerBorrowForm';
import ManagerPaybackForm from './ManagerPaybackForm/ManagerPaybackForm';
import CdpAfterVal from './CdpAfterVal';
import { formatNumber, formatStabilityFee } from '../../utils/utils';
import {
  getMaxDaiAction,
  getMaxEthWithdrawAction,
  getMaxEthRepayAction,
  getMaxDaiBoostAction,
} from '../../actions/dashboardActions';
import { openCloseCdpModal, openTransferCdpModal } from '../../actions/modalActions';
import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

import './ManagerPage.scss';
import './action-items.scss';

class ManagerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMkr: true,
    };

    this.init = this.init.bind(this);
  }

  componentWillMount() {
    this.init();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.cdp.id !== this.props.cdp.id) this.init();
  }

  init() {
    // TODO optimize this by putting it borrow or payback
    this.props.getMaxDaiAction();
    this.props.getMaxEthWithdrawAction();
    this.props.getMaxEthRepayAction();
    this.props.getMaxDaiBoostAction();
  }

  convertStabilityFee() {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      showMkr: !this.state.showMkr,
    });
  }

  render() {
    const {
      cdp, gettingEthPrice, ethPrice, gettingAfterCdp, afterCdp, afterType,
      openCloseCdpModal, openTransferCdpModal, history,
    } = this.props;

    const stabilityFee = this.state.showMkr ? cdp.governanceFee : cdp.governanceFeeInUsd;

    return (
      <div className="manager-page-wrapper dashboard-page-wrapper">
        <div className="content-wrapper">
          <div className="width-container">
            <div className="main-section-wrapper">
              <div className="main-subsection">
                <div className="info-wrapper-main">
                  <div className="item">
                    <div className="label">Liquidation price</div>
                    <div className="value">
                      <TooltipWrapper title={cdp.liquidationPrice}>
                        { formatNumber(cdp.liquidationPrice, 2) }$
                      </TooltipWrapper>
                    </div>
                    <CdpAfterVal
                      type={afterType}
                      loading={gettingAfterCdp}
                      cdp={afterCdp}
                      cdpProp="liquidationPrice"
                      symbol="$"
                    />
                  </div>

                  <div className="item">
                    <div className="label">Current price</div>
                    <div className="value">
                      { gettingEthPrice && 'Loading...' }
                      {
                        !gettingEthPrice && (
                          <TooltipWrapper title={ethPrice}>{ formatNumber(ethPrice, 2) }$</TooltipWrapper>
                        )
                      }
                    </div>
                  </div>

                  <div className="item">
                    <div className="label">Ratio</div>
                    <div className="value">
                      <TooltipWrapper title={cdp.ratio}>
                        { formatNumber(cdp.ratio, 2) }%
                      </TooltipWrapper>
                    </div>
                    <CdpAfterVal
                      type={afterType}
                      loading={gettingAfterCdp}
                      cdp={afterCdp}
                      cdpProp="ratio"
                      symbol="%"
                    />
                  </div>
                </div>

                <div className="row-item-wrapper">
                  <DaiIcon />

                  <div className="row-val-wrapper">
                    <span className="label">Debt</span>
                    <span className="value">
                      <TooltipWrapper title={cdp.debtDai}>
                        { formatNumber(cdp.debtDai, 2) } Dai
                      </TooltipWrapper>
                    </span>
                  </div>
                </div>

                <div className="row-item-wrapper">
                  <EthIcon />

                  <div className="row-val-wrapper">
                    <span className="label">Collateral</span>
                    <span className="value">
                      <TooltipWrapper title={cdp.depositedETH}>
                        { formatNumber(cdp.depositedETH, 2) } Eth
                      </TooltipWrapper>
                    </span>
                  </div>
                </div>

                <div className="row-item-wrapper">
                  <MkrIcon />

                  <div className="row-val-wrapper">
                    <span className="label">Stability Fee</span>
                    <span className="value">
                      <TooltipWrapper title={stabilityFee}>
                        {
                          formatStabilityFee(stabilityFee)
                        }
                      </TooltipWrapper>

                      <span className="stability-label-group">
                        <span
                          // eslint-disable-next-line prefer-template
                          className={'stability-label ' + (this.state.showMkr ? ' active' : ' inactive')}
                          onClick={() => this.convertStabilityFee()}
                        >
                        MKR
                        </span>
                        <span className="divder"> | </span>
                        <span
                          // eslint-disable-next-line prefer-template
                          className={'stability-label ' + (this.state.showMkr ? ' inactive' : ' active')}
                          onClick={() => this.convertStabilityFee()}
                        >
                        USD
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="main-subsection">
                <PieChart
                  values={[
                    { data: cdp.debtDai, color: '#61717E', label: 'Debt' },
                    { data: cdp.depositedUSD, color: '#37B06F', label: 'Collateral' },
                  ]}
                />
              </div>
            </div>

            <div className="bottom-controls">
              <button type="button" className="button gray uppercase" onClick={() => { openCloseCdpModal(history); }}>
                Close
              </button>

              <button
                type="button"
                className="button green uppercase"
                onClick={() => { openTransferCdpModal(history); }}
              >
                Transfer
              </button>
            </div>

            <div className="actions-section-wrapper">
              <Tabs>
                <div label="Borrow">
                  <ManagerBorrowForm />
                </div>

                <div label="Payback">
                  <ManagerPaybackForm />
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManagerPage.defaultProps = {
  afterCdp: null,
  afterType: null,
};

ManagerPage.propTypes = {
  cdp: PropTypes.object.isRequired,
  ethPrice: PropTypes.number.isRequired,
  gettingEthPrice: PropTypes.bool.isRequired,
  getMaxDaiAction: PropTypes.func.isRequired,
  getMaxEthRepayAction: PropTypes.func.isRequired,
  getMaxDaiBoostAction: PropTypes.func.isRequired,
  getMaxEthWithdrawAction: PropTypes.func.isRequired,
  gettingAfterCdp: PropTypes.bool.isRequired,
  afterCdp: PropTypes.object,
  afterType: PropTypes.string,
  openCloseCdpModal: PropTypes.func.isRequired,
  openTransferCdpModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = ({ general, dashboard }) => ({
  cdp: general.cdp,
  ethPrice: general.ethPrice,
  gettingEthPrice: general.gettingEthPrice,
  gettingAfterCdp: dashboard.gettingAfterCdp,
  afterCdp: dashboard.afterCdp,
  afterType: dashboard.afterType,
  accountType: general.accountType,
  account: general.account,
  network: general.network,
});

const mapDispatchToProps = {
  getMaxDaiAction,
  getMaxEthWithdrawAction,
  openCloseCdpModal,
  openTransferCdpModal,
  getMaxEthRepayAction,
  getMaxDaiBoostAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PieChart from '../PieChart/PieChart';
import Tabs from '../Tabs/Tabs';
import DaiIcon from '../Decorative/DaiIcon';
import EthIcon from '../Decorative/EthIcon';
import MkrIcon from '../Decorative/MkrIcon';
import ManagerBorrowForm from './ManagerBorrowForm/ManagerBorrowForm';
import ManagerPaybackForm from './ManagerPaybackForm/ManagerPaybackForm';
import CdpAfterVal from './CdpAfterVal';
import { formatNumber, formatStabilityFee } from '../../utils/utils';
import { openCloseCdpModal, openTransferCdpModal } from '../../actions/modalActions';
import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

import './ManagerPage.scss';
import './action-items.scss';

class ManagerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMkr: true,
      showEth: true,
    };

    this.convertStabilityFee = this.convertStabilityFee.bind(this);
    this.convertCollateral = this.convertCollateral.bind(this);
  }

  convertStabilityFee() {
    this.setState(prevState => ({ showMkr: !prevState.showMkr }));
  }

  convertCollateral() {
    this.setState(prevState => ({ showEth: !prevState.showEth }));
  }

  render() {
    const {
      cdp, gettingEthPrice, ethPrice, gettingAfterCdp, afterCdp, afterType,
      openCloseCdpModal, openTransferCdpModal, history,
    } = this.props;
    const { showMkr, showEth } = this.state;

    const stabilityFee = showMkr ? cdp.governanceFee : cdp.governanceFeeInUsd;
    const collateral = showEth ? cdp.depositedETH : cdp.depositedPETH;

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
                    <Tooltip>
                      <span className="label">
                        <i className="icon icon-Info-circle" />
                        Debt
                      </span>
                    </Tooltip>
                    <span className="value">
                      <TooltipWrapper title={cdp.debtDai}>
                        { formatNumber(cdp.debtDai, 2) } Dai
                      </TooltipWrapper>
                    </span>

                    <CdpAfterVal
                      type={afterType}
                      loading={gettingAfterCdp}
                      cdp={afterCdp}
                      cdpProp="debtDai"
                    />
                  </div>
                </div>

                <div className="row-item-wrapper with-switch">
                  <EthIcon />

                  <div className="row-val-wrapper">
                    <div className="label-wrapper">
                      <Tooltip>
                        <span className="label">
                          <i className="icon icon-Info-circle" />
                          Collateral in
                        </span>
                      </Tooltip>

                      <span className="stability-label-group">
                        <span
                          className={`stability-label ${showEth ? 'active' : 'inactive'}`}
                          onClick={() => this.convertCollateral()}
                        >
                          ETH
                        </span>
                        <span className="divder"> | </span>
                        <span
                          className={`stability-label ${showEth ? 'inactive' : 'active'}`}
                          onClick={() => this.convertCollateral()}
                        >
                          PETH
                        </span>
                      </span>
                    </div>

                    <span className="value">
                      <TooltipWrapper title={collateral}>
                        { formatNumber(collateral, 2) }
                      </TooltipWrapper>
                    </span>

                    <CdpAfterVal
                      type={afterType}
                      loading={gettingAfterCdp}
                      cdp={afterCdp}
                      cdpProp="depositedETH"
                    />
                  </div>
                </div>

                <div className="row-item-wrapper  with-switch">
                  <MkrIcon />

                  <div className="row-val-wrapper">
                    <div className="label-wrapper">
                      <Tooltip>
                        <span className="label">
                          <i className="icon icon-Info-circle" />
                          Stability fee in
                        </span>
                      </Tooltip>

                      <span className="stability-label-group">
                        <span
                          className={`stability-label ${showMkr ? 'active' : 'inactive'}`}
                          onClick={() => this.convertStabilityFee()}
                        >
                        MKR
                        </span>
                        <span className="divder"> | </span>
                        <span
                          className={`stability-label ${showMkr ? 'inactive' : 'active'}`}
                          onClick={() => this.convertStabilityFee()}
                        >
                        USD
                        </span>
                      </span>
                    </div>

                    <span className="value">
                      <TooltipWrapper title={stabilityFee}>
                        { formatStabilityFee(stabilityFee) }
                      </TooltipWrapper>
                    </span>
                  </div>
                </div>
              </div>

              <div className="main-subsection chart">
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

const mapDispatchToProps = { openCloseCdpModal, openTransferCdpModal };

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);

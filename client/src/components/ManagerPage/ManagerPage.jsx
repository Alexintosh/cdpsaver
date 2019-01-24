import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PieChart from '../PieChart/PieChart';
import Tabs from '../Tabs/Tabs';
import DaiIcon from '../Decorative/DaiIcon';
import EthIcon from '../Decorative/EthIcon';
import ManagerBorrowForm from './ManagerBorrowForm/ManagerBorrowForm';
import ManagerPaybackFrom from './ManagerPaybackFrom/ManagerPaybackFrom';
import CdpAfterVal from './CdpAfterVal';
import { formatAccType, formatAcc } from '../../utils/utils';
import { getMaxDaiAction, getMaxEthWithdrawAction } from '../../actions/dashboardActions';
import { openCloseCdpModal, openTransferCdpModal } from '../../actions/modalActions';

import './ManagerPage.scss';
import './action-items.scss';

class ManagerPage extends Component {
  componentWillMount() {
    // TODO optimize this by putting it borrow or payback
    this.props.getMaxDaiAction();
    this.props.getMaxEthWithdrawAction();
  }

  render() {
    const {
      cdp, gettingEthPrice, ethPrice, gettingAfterCdp, afterCdp, afterType, accountType,
      account, openCloseCdpModal, openTransferCdpModal, history,
    } = this.props;

    return (
      <div className="manager-page-wrapper dashboard-page-wrapper">
        <div className="sub-heading-wrapper">
          <div className="width-container">
            <div className="sub-title with-label">
              <div className="label">CDP ID:</div>
              <div className="value">{ cdp.id }</div>
            </div>

            <div className="account-wrapper">
              <div className="acc-type">{ formatAccType(accountType) }</div>
              <div className="connected">Connected:</div>
              <div className="acc">{ formatAcc(account) }</div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="width-container">
            <div className="main-section-wrapper">
              <div className="main-subsection">
                <div className="info-wrapper-main">
                  <div className="item">
                    <div className="label">Liquidation price</div>
                    <div className="value">{ cdp.liquidationPrice.toFixed(2) }$</div>
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
                    <div className="value">{ gettingEthPrice ? 'Loading...' : ethPrice }$</div>
                  </div>

                  <div className="item">
                    <div className="label">Ratio</div>
                    <div className="value">{ (cdp.ratio).toFixed(2) }%</div>
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
                    <span className="label">Debt:</span>
                    <span className="value">{ cdp.debtDai.toFixed(2) } Dai</span>
                  </div>
                </div>

                <div className="row-item-wrapper">
                  <EthIcon />

                  <div className="row-val-wrapper">
                    <span className="label">Collateral amount:</span>
                    <span className="value">{ cdp.depositedETH.toFixed(2) } Eth</span>
                  </div>
                </div>
              </div>

              <div className="main-subsection">
                <PieChart
                  values={[
                    { data: cdp.debtDai.toFixed(2), color: '#61717E', label: 'Debt' },
                    { data: cdp.depositedUSD.toFixed(2), color: '#37B06F', label: 'Collateral' },
                  ]}
                />
              </div>
            </div>

            <div className="bottom-controls">
              <button type="button" className="button gray uppercase" onClick={openCloseCdpModal}>
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

                  <div className="info-text">
                    *Repay will draw ETH from cdp and repay in DAI, lowering the liq. price
                  </div>
                </div>

                <div label="Payback">
                  <ManagerPaybackFrom />

                  <div className="info-text">
                    *Boost will draw DAI and buy ETH, increasing the amount ETH in the cdp
                  </div>
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
  getMaxEthWithdrawAction: PropTypes.func.isRequired,
  gettingAfterCdp: PropTypes.bool.isRequired,
  afterCdp: PropTypes.object,
  afterType: PropTypes.string,
  accountType: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
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
});

const mapDispatchToProps = {
  getMaxDaiAction, getMaxEthWithdrawAction, openCloseCdpModal, openTransferCdpModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PieChart from '../PieChart/PieChart';
import Tabs from '../Tabs/Tabs';
import ManagerBorrowForm from './ManagerBorrowForm/ManagerBorrowForm';
import ManagerPaybackFrom from './ManagerPaybackFrom/ManagerPaybackFrom';
import { getMaxDaiAction } from '../../actions/dashboardActions';

import './ManagerPage.scss';
import './action-items.scss';

class ManagerPage extends Component {
  componentWillMount() {
    this.props.getMaxDaiAction();
  }

  render() {
    const { cdp, gettingEthPrice, ethPrice } = this.props;

    return (
      <div className="manager-page-wrapper dashboard-page-wrapper">
        <div className="sub-heading-wrapper">
          <div className="width-container">
            <div className="sub-title">Manage</div>
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
                  </div>

                  <div className="item">
                    <div className="label">Current price</div>
                    <div className="value">{ gettingEthPrice ? 'Loading...' : ethPrice }</div>
                  </div>

                  <div className="item">
                    <div className="label">Ratio</div>
                    <div className="value">{ (cdp.ratio).toFixed(2) }%</div>
                  </div>
                </div>

                <div className="row-item-wrapper">
                  <span className="label">Debt:</span>
                  <span className="value">{ cdp.debtDai.toFixed(2) } Dai</span>
                </div>

                <div className="row-item-wrapper">
                  <span className="label">Collateral amount:</span>
                  <span className="value">{ cdp.depositedETH.toFixed(2) } Eth</span>
                </div>
              </div>

              <div className="separator" />

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
              <button type="button" className="button gray uppercase">Close</button>
              <button type="button" className="button green uppercase">Transfer</button>
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

ManagerPage.propTypes = {
  cdp: PropTypes.object.isRequired,
  ethPrice: PropTypes.number.isRequired,
  gettingEthPrice: PropTypes.bool.isRequired,
  getMaxDaiAction: PropTypes.func.isRequired,
};

const mapStateToProps = ({ general }) => ({
  cdp: general.cdp,
  ethPrice: general.ethPrice,
  gettingEthPrice: general.gettingEthPrice,
});

const mapDispatchToProps = { getMaxDaiAction };

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);

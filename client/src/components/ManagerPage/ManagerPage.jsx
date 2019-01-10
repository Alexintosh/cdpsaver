import React from 'react';
import PieChart from '../PieChart/PieChart';
import Tabs from '../Tabs/Tabs';
import ManagerBorrowForm from './ManagerBorrowForm/ManagerBorrowForm';

import './ManagerPage.scss';
import './action-items.scss';

const ManagerPage = () => (
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
                <div className="value">48$</div>
              </div>

              <div className="item">
                <div className="label">Current price</div>
                <div className="value">78$</div>
              </div>

              <div className="item">
                <div className="label">Ratio</div>
                <div className="value">220%</div>
              </div>
            </div>

            <div className="row-item-wrapper">
              <span className="label">Debt:</span>
              <span className="value">3600 Dai</span>
            </div>

            <div className="row-item-wrapper">
              <span className="label">Collateral amount:</span>
              <span className="value">360 Eth</span>
            </div>
          </div>

          <div className="separator" />

          <div className="main-subsection">
            <PieChart
              values={[
                { data: 600, color: '#61717E', label: 'Debt' },
                { data: 220, color: '#37B06F', label: 'Collateral' },
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
              content
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
);

ManagerPage.propTypes = {};

export default ManagerPage;

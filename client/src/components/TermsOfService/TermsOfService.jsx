/* eslint-disable max-len */
import React from 'react';
import Footer from '../Footer/Footer';

import './TermsOfService.scss';

const TermsOfService = () => (
  <div className="terms-of-service-wrapper">
    <div className="first-section">
      <div className="jumbotron-heading">Terms of service</div>
    </div>

    <div className="points-wrapper">
      <div className="point">
        <div className="point-header">General terms of service</div>
        <div className="point-text">
          CDP Saver is an application that runs within the MakerDAO Dai system. In order to fully understand the workings of the systems and the terms of service, we recommend reading the Dai Stablecoin System whitepaper, as well as the Dai Public Announcement and Dai Terms of Service available in the MakerDAO CDP Portal.
        </div>

        <div className="point-text">
          Although all of these consequently apply to CDP Saver, we would like to specifically highlight the following excerpt from their Announcement Disclaimer:
        </div>

        <div className="point-text">
          Dai System and Software is based on experimental blockchain and smart contract technology which carries significant and inherent operational, technological, financial and regulatory risks. It cannot be excluded that, as a result of defects, technical bugs, network forks, intentional attacks of third parties, acts of God, unscheduled maintenance, or other events, the Dai System and Software experiences disruption, suspension or termination, and/or the value of Dai over time may experience extreme volatility or depreciate in full, as well as ETH may be lost. Attacks by hackers on the Dai System and Software, smart contracts or other software used may have unforeseeable consequences, including loss of Dai and/or ETH. Also, market conditions may change and thus no market liquidity is guaranteed. All smart contracts are ultimately controlled by the network of miners. There are also other risks associated with use of the Dai System and Software, including those that cannot be anticipated and by clicking Accept below you declare and confirm that you understand the risks of using experimental public blockchain technology.
        </div>

        <div className="point-text">
          The Dai System and Software and all of the matters set forth in the White Paper are new and untested. Use of the Dai System and Software requires deep knowledge of smart contract technology and related fields. Its use without proper skills and preparation may result in unintended consequences. Source code of the Dai System and Software as well as information on security reviews conducted so far is available here: https://medium.com/@MakerDAO/single-collateral-dai-source-code-and-security-reviews-523e1a01a3c8.
        </div>

        <div className="point-text">
          All users of the Dai System and Software expressly acknowledge, understands and agrees that the user is using the Dai System and Software at the user’s sole risk and that the Dai System and Software are each provided, used and acquired on an “AS IS” and on an “AS AVAILABLE” basis without representations, warranties, promises or guarantees whatsoever of any kind by any entity and the user shall rely on its own examination and investigation thereof.
        </div>

      </div>
    </div>

    <Footer />
  </div>
);

TermsOfService.propTypes = {};

export default TermsOfService;

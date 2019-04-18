import React from 'react';
import Footer from '../Footer/Footer';

import './TermsOfService.scss';

const TermsOfService = () => (
  <div className="terms-of-service-wrapper">
    <div className="first-section">
      <div className="jumbotron-heading">Terms of service</div>
      <div className="jumbotron-sub-heading">Last revised: 17 May 2018</div>
    </div>

    <div className="points-wrapper">
      <div className="point">
        <div className="point-header">1. Acceptance of Terms</div>
        <div className="point-text">
          The Dai System and Software is an autonomous system of smart contracts on the
          Ethereum Blockchain (the Open Source Software), that permits, among other things, the generation of Dai.
          Dai is a cryptocurrency intended to maintain low volatility that is available at dai.makerdao.com and via
          other tools (the Site) — which includes text, images, audio, code and other materials (collectively, the
          Content) and all of the features, and services provided. The Site, and any other features, tools,
          materials, the Open Source Software, or other services offered from time to time are referred to here as
          the Service. Note however, that while the Open Source Software is intended to maintain low volatility for
          Dai, the Open Source Software is an experimental prototype and its use involves a high degree of risk. There
          are numerous ways the Open Source Software and Service could fail in an unexpected way, resulting in the
          total and absolute loss of all of your funds
        </div>

        <div className="point-text">
          Please read these Terms of Use (the Terms or Terms of Use) carefully before
          using the Service. By using or otherwise accessing the Service, or clicking to accept or agree to these
          Terms where that option is made available, you (1) accept and agree to these Terms and (2) any additional
          terms, rules and conditions of participation issued from time to time. If you do not agree to the Terms, then
          you may not access or use the Content or Service.
        </div>
      </div>

      <div className="point">
        <div className="point-header">2. Modification of Terms of Use</div>
        <div className="point-text">
          These Terms may be discretionarily modified or replaced at any time, unless stated otherwise herein.
          The most current version of these Terms will be posted on the Site with the Last Revised date at the top of
          the Terms changed. Any changes or modifications will be effective immediately upon posting the revisions to
          the Site. You shall be responsible for reviewing and becoming familiar with any such modifications. You waive
          any right you may have to receive specific notice of such changes or modifications. Use of the Service by you
          after any modification to the Terms constitutes your acceptance of the Terms as modified. If you do not agree
          to the Terms in effect when you access or use the Service, you must stop using the Service.
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

TermsOfService.propTypes = {};

export default TermsOfService;

import React from 'react';
import ComingSoonSubscribe from '../ComingSoonSubscribe/ComingSoonSubscribe';

import './SaverPage.scss';

const SaverPage = () => (
  <div className="saver-page-wrapper dashboard-page-wrapper">
    <div className="content-wrapper">
      <ComingSoonSubscribe title="Saver" />
    </div>
  </div>
);

export default SaverPage;

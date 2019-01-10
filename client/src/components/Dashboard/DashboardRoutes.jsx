import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import MonitoringPage from '../MonitoringPage/MonitoringPage';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import SaverPage from '../SaverPage/SaverPage';
import ManagerPage from '../ManagerPage/ManagerPage';
import DashboardRedirect from './DashboardRedirect';

import './Dashboard.scss';

const DashboardRoutes = ({ match }) => (
  <React.Fragment>
    <Route exact path={`${match.path}`} component={DashboardRedirect} />
    <Route path={`${match.path}/saver`} component={SaverPage} />
    <Route path={`${match.path}/manage`} component={ManagerPage} />
    <Route path={`${match.path}/monitoring`} component={MonitoringPage} />
    <Route path={`${match.path}/marketplace`} component={MarketplacePage} />
  </React.Fragment>
);

DashboardRoutes.propTypes = {
  match: PropTypes.object.isRequired,
};

export default DashboardRoutes;

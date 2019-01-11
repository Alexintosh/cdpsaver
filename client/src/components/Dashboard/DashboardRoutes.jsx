import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import MonitoringPage from '../MonitoringPage/MonitoringPage';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import SaverPage from '../SaverPage/SaverPage';
import ManagerPage from '../ManagerPage/ManagerPage';
import DashboardRedirect from './DashboardRedirect';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

import './Dashboard.scss';

const DashboardRoutes = ({ match }) => (
  <React.Fragment>
    <Route exact path={`${match.path}`} component={DashboardRedirect} />
    <Route path={`${match.path}/marketplace`} component={MarketplacePage} />
    <PrivateRoute path={`${match.path}/saver`} component={SaverPage} />
    <PrivateRoute path={`${match.path}/manage`} component={ManagerPage} />
    <PrivateRoute path={`${match.path}/monitoring`} component={MonitoringPage} />
  </React.Fragment>
);

DashboardRoutes.propTypes = {
  match: PropTypes.object.isRequired,
};

export default DashboardRoutes;

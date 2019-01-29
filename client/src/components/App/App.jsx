import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { updateEthPriceInterval, listenToAccChange } from '../../actions/generalActions';
import { silentLogin } from '../../actions/accountActions';
import Header from '../Header/Header';
import HomePage from '../HomePage/HomePage';
import OnboardingRoutes from '../Onboarding/OnboardingRoutes';
import Page404 from '../Page404/Page404';
import DashboardRoutes from '../Dashboard/DashboardRoutes';
import ModalRoot from '../Modals/ModalRoot';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import Notifications from '../Notifications/Notifications';
import Connect from '../Connect/Connect';
import TxNotifications from '../TxNotifications/TxNotifications';

import './App.scss';
import '../../common/icons/icons.scss';

class RoutesWrapper extends Component {
  componentWillMount() {
    this.props.listenToAccChange();
    this.props.updateEthPriceInterval();
    this.props.silentLogin();
  }

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="app">
            <Header />
            <Notifications />
            <TxNotifications />

            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/connect" component={Connect} />
              <Route path="/onboarding" component={OnboardingRoutes} />
              <Route path="/marketplace" component={MarketplacePage} />
              <PrivateRoute path="/dashboard" component={DashboardRoutes} />
              <Route path="*" component={Page404} />
            </Switch>

            <ModalRoot />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

RoutesWrapper.propTypes = {
  store: PropTypes.object.isRequired,
  silentLogin: PropTypes.func.isRequired,
  updateEthPriceInterval: PropTypes.func.isRequired,
  listenToAccChange: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updateEthPriceInterval, silentLogin, listenToAccChange,
};

export default connect(null, mapDispatchToProps)(RoutesWrapper);

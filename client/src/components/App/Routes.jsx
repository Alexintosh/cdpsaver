import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../Header/Header';
import HomePage from '../HomePage/HomePage';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import SaverPage from '../SaverPage/SaverPage';
import MonitoringPage from '../MonitoringPage/MonitoringPage';
import OnboardingRoutes from '../Onboarding/OnboardingRoutes';
import Page404 from '../Page404/Page404';

import '../../common/icons/icons.scss';

class RoutesWrapper extends Component {
  componentWillMount() {}

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="app">
            <Header />

            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/marketplace" component={MarketplacePage} />
              <Route path="/onboarding" component={OnboardingRoutes} />
              <Route path="/monitoring" component={MonitoringPage} />
              <Route path="/saver" component={SaverPage} />
              <Route path="*" component={Page404} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

RoutesWrapper.propTypes = {
  store: PropTypes.object.isRequired,
};

const mapDispatchToProps = {};

export default connect(null, mapDispatchToProps)(RoutesWrapper);

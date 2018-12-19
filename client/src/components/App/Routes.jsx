import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../Header/Header';
import Homepage from '../HomePage/Homepage';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import SaverPage from '../SaverPage/SaverPage';
import NotifierPage from '../NotifierPage/NotifierPage';
import Page404 from '../Page404/Page404';

class RoutesWrapper extends Component {
  componentWillMount() {}

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Header />

            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route path="/marketplace" component={MarketplacePage} />
              <Route path="/saver" component={SaverPage} />
              <Route path="/notifier" component={NotifierPage} />
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

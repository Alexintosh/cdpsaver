import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Homepage from '../Homepage/Homepage';
import Marketplace from '../Marketplace/Marketplace';
import CdpSaver from '../CdpSaver/CdpSaver';
import CdpNotifier from '../CdpNotifier/CdpNotifier';
import Page404 from '../Page404/Page404';

class RoutesWrapper extends Component {
  componentWillMount() {}

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Homepage} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/cdpsaver" component={CdpSaver} />
            <Route path="/cdpnotifier" component={CdpNotifier} />
            <Route component={Page404} />
          </Switch>
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

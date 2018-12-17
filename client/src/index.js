import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';

import './index.css';
import App from './App';
import Home from './Homepage/Home';
import Marketplace from './Marketplace/Marketplace';
import CdpSaver from './CdpSaver/CdpSaver';
import CdpNotifier from './CdpNotifier/CdpNotifier';

import Page404 from './Page404';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/cdpsaver" component={CdpSaver} />
          <Route path="/cdpnotifier" component={CdpNotifier} />
        </Route>
        <Route path='*' exact={true} component={Page404} />
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);

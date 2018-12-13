import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';

import './index.css';
import App from './App';
import Home from './Homepage/Home'

import Page404 from './Page404';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
        </Route>
        <Route path='*' exact={true} component={Page404} />
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);

ReactDOM.render(<App />, document.getElementById('root'));

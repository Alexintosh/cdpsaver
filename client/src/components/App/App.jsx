import React from 'react';
import PropTypes from 'prop-types';
import Routes from './Routes';

import './App.scss';

const App = ({ store }) => (
  <div className="app-wrapper">
    <Routes store={store} />
  </div>
);

App.propTypes = {
  store: PropTypes.object.isRequired,
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import store from './store';
import './tracker';

ReactDOM.render(<App store={store} />, document.getElementById('root'));

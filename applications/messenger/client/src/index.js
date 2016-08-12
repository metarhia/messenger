import 'babel-polyfill';
import './impress';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './containers/App';
import configureStore from './store/configureStore';

import './index.css';
import 'antd/dist/antd.css';

const store = configureStore({
  rooms: [
    {
      title: 'Test 1',
      messages: [
        {
          sender: 'user1',
          text: 'lorem ipsum'
        }
      ]
    },
    {
      title: 'Test 2',
      messages: [
        {
          sender: 'user1',
          text: 'lorem ipsum'
        }
      ]
    }
  ]
});

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
);

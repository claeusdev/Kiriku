import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Root } from './components/Root';

import createHistory from 'history/createBrowserHistory';
import configureStore from './configureStore';

import $ from 'jquery';
window.$ = window.jQuery = $;

const history = createHistory();
const store = configureStore(history);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
registerServiceWorker();

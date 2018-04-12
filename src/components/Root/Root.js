import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';

import { NotFound } from '../pages/NotFound';
import Login from '../pages/Login/Container'; 
import AuthenticatedRoute from '../AuthenticatedRoute/Container';
import UnauthenticatedRoute from '../UnauthenticatedRoute/Container';

const Root = ({ store, history }) => {
  return (
    <div id="App">
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <UnauthenticatedRoute exact path="/" component={Login}/>
            <Route component={NotFound}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    </div>
  );
}

export default Root;

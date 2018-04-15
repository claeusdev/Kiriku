import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';

import AuthenticatedRoute from '../AuthenticatedRoute/Container';
import UnauthenticatedRoute from '../UnauthenticatedRoute/Container';
import Admin from '../screens/Admin/Container'; 
import Login from '../screens/Login/Container'; 

const Root = ({ store, history }) => {
  return (
    <div id="App">
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" render={(props) => {
              return <Redirect to='/admin' />
            }}/>
            <AuthenticatedRoute path="/admin" component={Admin}/>
            <UnauthenticatedRoute path="/login" component={Login}/>
            <Route component={() => <p>That page doesn't exist</p>}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    </div>
  );
}

export default Root;

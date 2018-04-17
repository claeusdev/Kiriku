import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = ({ component: Component, auth, ...rest }, context) => {
  return (
    <Route {...rest} render={props => (
      !auth.isEmpty ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
        )
    )} />
  );
}

export default AuthenticatedRoute;

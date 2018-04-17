import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const UnauthenticatedRoute = ({ component: Component, auth, ...rest }, context) => {
  return (
    <Route {...rest} render={props => (
      auth.isEmpty ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: '/admin',
            state: { from: props.location }
          }} />
        )
    )} />
  );
}

export default UnauthenticatedRoute;


import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  isLoaded,
} from 'react-redux-firebase'

const AuthenticatedRoute = ({ component: Component, auth, ...rest }, context) => {
  if (isLoaded(auth)) {
    return (
      <Route {...rest} render={props => (
        !auth ? (
          <Component {...props} />
        ) : (
            <Redirect to={{
              pathname: '/dashboard',
              state: { from: props.location }
            }} />
          )
      )} />
    );
  } else {
    return null;
  }
}

export default AuthenticatedRoute;


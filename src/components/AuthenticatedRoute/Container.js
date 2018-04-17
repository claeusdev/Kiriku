import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import {
  firebaseConnect,
  pathToJS,
} from 'react-redux-firebase'

const mapStateToProps = (state) => {
  const { firebase: { auth } } = state;
  return {
    auth
  };
};

const mapDispatchToProps = (dispatch) => ({
});

const Container = compose(
  firebaseConnect([
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet)

export default Container;
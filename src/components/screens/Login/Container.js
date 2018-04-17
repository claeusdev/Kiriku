import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { push } from 'react-router-redux/actions';
import {
  firebaseConnect,
} from 'react-redux-firebase'

const mapStateToProps = (state) => {
  const { firebase: { auth } } = state;
  return {
    auth
  };
};

const mapDispatchToProps = (dispatch) => ({
  onLogin() {
    dispatch(push('/admin'));
  }
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

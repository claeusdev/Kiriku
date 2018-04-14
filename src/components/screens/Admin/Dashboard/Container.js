import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import {
  firebaseConnect,
  dataToJS,
  pathToJS
} from 'react-redux-firebase'

const mapStateToProps = (state) => {
  return {
    auth: pathToJS(state.firebase, 'auth') 
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
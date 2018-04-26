import Outlet from './index';
import { connect } from 'react-redux';
import { compose } from 'redux'
import {
  firestoreConnect
} from 'react-redux-firebase'

const mapStateToProps = (state) => {
  const { firebase: { auth, profile } } = state;
  const { firestore: { ordered: { tags } } } = state;

  return {
    auth,
    tags
  };
};

const mapDispatchToProps = (dispatch) => ({
});

const Container = compose(
  firestoreConnect([{
    collection: 'tags'
  }]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet);

export default Container;
import Outlet from './index';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { push } from 'react-router-redux/actions';
import {
  withFirestore,
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
  onSave() {
    dispatch(push('/admin/collections/gif'));
  }
});

const Container = compose(
  withFirestore,
  firestoreConnect([{
    collection: 'tags'
  }]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet);

export default Container;
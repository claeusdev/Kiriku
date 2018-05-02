import Outlet from './index';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { push } from 'react-router-redux/actions';
import {
  withFirestore,
  firestoreConnect,
  isLoaded
} from 'react-redux-firebase'

const mapStateToProps = (state) => {
  const { firebase: { auth, profile } } = state;
  const { firestore: { ordered: { tags, gifs } } } = state;

  let gif = undefined;
  if (isLoaded(gifs)) {
    gif = gifs[0];
  }

  return {
    auth,
    tags,
    gif
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSave() {
    dispatch(push('/admin/collections/gif'));
  }
});

const Container = compose(
  withFirestore,
  firestoreConnect(({ match, location }) => {
    return [
      {
        collection: 'tags',
      },
      {
        collection: 'gifs',
        doc: match.params['gif_id']
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet);

export default Container;
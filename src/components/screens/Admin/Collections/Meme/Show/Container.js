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
  const { firestore: { ordered: { tags, memes } } } = state;

  let meme = undefined;
  if (isLoaded(memes)) {
    meme = memes[0];
  }

  return {
    auth,
    tags,
    meme
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSave() {
    dispatch(push('/admin/collections/meme'));
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
        collection: 'memes',
        doc: match.params['meme_id']
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet);

export default Container;
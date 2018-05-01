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
  const { firestore: { ordered: { tags, articles } } } = state;

  let article = undefined;
  if (isLoaded(articles)) {
    article = articles[0];
  }

  return {
    auth,
    tags,
    article
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSave() {
    dispatch(push('/admin/collections/article'));
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
        collection: 'articles',
        doc: match.params['article_id']
      }
    ];
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet);

export default Container;
import Outlet from './index';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { push } from 'react-router-redux/actions';
import keyBy from 'lodash/keyBy';

import {
  withFirestore,
  firestoreConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'

const mapStateToProps = (state) => {
  const { firebase: { auth, profile } } = state;
  const { firestore: { data: { tags, countries } } } = state;
  let { firestore: { ordered: { memes, users } } } = state;

  const collectionsLoaded = isLoaded(memes) && isLoaded(users) && isLoaded(countries) && isLoaded(tags);

  if (collectionsLoaded) {
    const usersKeyedById = keyBy(users, user => user.id);
    memes = memes.map(meme => {
      return {
        ...meme,
        author: usersKeyedById[meme.author],
        tags: meme.tags.map(tag => tags[tag]),
        countries: meme.countries.map(country => countries[country])
      }
    });
  }

  return {
    auth,
    memes: collectionsLoaded ? memes : undefined
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSave() {
    dispatch(push('/admin/collections/meme'));
  }
});

const Container = compose(
  withFirestore,
  firestoreConnect([
    {
      collection: 'memes'
    },
    {
      collection: 'tags'
    },
    {
      collection: 'countries'
    },
    {
      collection: 'users'
    }
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet);

export default Container;
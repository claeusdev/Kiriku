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
  let { firestore: { ordered: { gifs, users } } } = state;

  const collectionsLoaded = isLoaded(gifs) && isLoaded(users) && isLoaded(countries) && isLoaded(tags);

  if (collectionsLoaded) {
    const usersKeyedById = keyBy(users, user => user.id);
    gifs = gifs.map(gif => {
      return {
        ...gif,
        author: usersKeyedById[gif.author],
        tags: gif.tags.map(tag => tags[tag]),
        countries: gif.countries.map(country => countries[country])
      }
    });
  }

  return {
    auth,
    gifs: collectionsLoaded ? gifs : undefined
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSave() {
    dispatch(push('/admin/collections/gif'));
  }
});

const Container = compose(
  withFirestore,
  firestoreConnect([
    {
      collection: 'gifs'
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
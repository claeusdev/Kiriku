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
  const { firestore: { data: { articles_tags: articlesTagsMap, tags, countries } } } = state;
  let { firestore: { ordered: { articles, users } } } = state;

  const collectionsLoaded = isLoaded(articles) && isLoaded(users) && isLoaded(countries) && isLoaded(tags);

  if (collectionsLoaded) {
    const usersKeyedById = keyBy(users, user => user.id);
    articles = articles.map(article => {
      return {
        ...article,
        author: usersKeyedById[article.author],
        tags: article.tags.map(tag => tags[tag]),
        countries: article.countries.map(country => countries[country])
      }
    });
  }

  return {
    auth,
    articles: collectionsLoaded ? articles : undefined
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSave() {
    dispatch(push('/admin/collections/article'));
  }
});

const Container = compose(
  withFirestore,
  firestoreConnect([
    {
      collection: 'articles'
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
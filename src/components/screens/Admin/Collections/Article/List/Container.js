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
  const { firestore: { data: { articles_tags: articlesTagsMap, users, tags, countries } } } = state;
  let { firestore: { ordered: { articles } } } = state;

  const articles_tags = [];
  for (var key in articlesTagsMap) {
    const data = articlesTagsMap[key];
    articles_tags.push({
      ...data,
      id: key
    });
  }

  articles = articles.map(article => {
    return {
      ...article,
      author: users[article.author],
      tags: article.tags.map(tag => tags[tag]),
      countries: article.countries.map(country => countries[country])
    }
  });

  console.log(articles);

  return {
    auth,
    articles,
    tags,
    countries,
    articles_tags
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
    // {
		// 	collection: 'articles_tags',
    //   storeAs: 'articlesTags'
		// }
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet);

export default Container;
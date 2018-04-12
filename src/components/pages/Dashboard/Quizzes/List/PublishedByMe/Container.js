
import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import {
  firebaseConnect,
  populatedDataToJS,
  pathToJS
} from 'react-redux-firebase'

const populates = [
  { child: 'author', root: 'users' }
]

const mapStateToProps = (state) => {
  return {
    quizzes: populatedDataToJS(state.firebase, 'allPublishedQuizzesByCurrentUser', populates),
    auth: pathToJS(state.firebase, 'auth')
  };
};

const mapDispatchToProps = (dispatch) => ({
});

const Container = compose(
  firebaseConnect(({ auth }) => {
    return [
      {
        path: 'quizzes',
        storeAs: 'allPublishedQuizzesByCurrentUser',
        queryParams: ['orderByChild=author', `equalTo=${auth.uid}`],
        populates
      }
    ]
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet)

export default Container;
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
    drafts: populatedDataToJS(state.firebase, 'allDraftQuizzes', populates),
    quizzes: populatedDataToJS(state.firebase, 'allPublishedQuizzes', populates),
    auth: pathToJS(state.firebase, 'auth')
  };
};

const mapDispatchToProps = (dispatch) => ({
});

const Container = compose(
  firebaseConnect([
    { path: 'drafts', storeAs: 'allDraftQuizzes', populates },
    { path: 'quizzes', storeAs: 'allPublishedQuizzes', populates }
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet)

export default Container;

import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import qs from 'qs';
import {
  firebaseConnect,
  dataToJS,
  pathToJS
} from 'react-redux-firebase'
import { saveQuiz, setUserFormErrors } from '../../../../../actions/createQuizPage';

const mapStateToProps = (state, ownProps) => {
  let { search } = ownProps.location;
  search = qs.parse(search.substring(1));
  const { status } = search;

  const { 
    isSavingQuiz,
    userFormErrors,
    appFormErrors
  } = state.app.createQuizPage;

  return {
    isSavingQuiz,
    userFormErrors,
    appFormErrors,
    quizStatus: status,
    quiz: dataToJS(state.firebase, 'currentQuiz'), 
    categories: dataToJS(state.firebase, 'categories'), 
    auth: pathToJS(state.firebase, 'auth') 
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSaveQuiz(data, path, firebase) {
    dispatch(saveQuiz(data, path, firebase));
  }, 
  onUserFormError(errors) {
    dispatch(setUserFormErrors(errors));
  },
  dispatch
});

const Container = compose(
  firebaseConnect(({ match, location }) => {
    const { id } = match.params;
    let { search } = location;
    search = qs.parse(search.substring(1));
    const { status } = search;

    const path = status === 'draft' ? 'drafts' : 'quizzes';

    // console.log(id, status);
    return [
      // `${path}#orderByKey&equalTo=${id}`,
      'categories',
      {
        path,
        storeAs: 'currentQuiz',
        queryParams: ['orderByKey', `equalTo=${id}`]
      }
    ]
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet)

export default Container;

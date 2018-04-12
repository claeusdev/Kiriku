import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import {
  firebaseConnect,
  dataToJS,
  pathToJS
} from 'react-redux-firebase'
import { saveQuiz, setUserFormErrors } from '../../../../../actions/createQuizPage';

const mapStateToProps = (state) => {
  const { 
    isSavingQuiz,
    userFormErrors,
    appFormErrors
  } = state.app.createQuizPage;

  return {
    isSavingQuiz,
    userFormErrors,
    appFormErrors,
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
  }
});

const Container = compose(
  firebaseConnect([
    'categories',
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet)

export default Container;

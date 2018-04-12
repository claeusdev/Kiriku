import { 
  SET_IS_SAVING_QUIZ,
  SET_USER_FORM_ERRORS,
  SET_APP_FORM_ERRORS
} from '../actions/createQuizPage';

import { combineReducers } from 'redux';

const isSavingQuiz = (state = false, action) => {
  switch (action.type) {
    case SET_IS_SAVING_QUIZ:
      return action.value;
    default:
      return state;
  }
}

const userFormErrors = (state = [], action) => {
  switch (action.type) {
    case SET_USER_FORM_ERRORS:
      return action.errors;
    default:
      return state;
  }
}

const appFormErrors = (state = [], action) => {
  switch (action.type) {
    case SET_APP_FORM_ERRORS:
      return action.error;
    default:
      return state;
  }
}

const createQuizPage = combineReducers({
  isSavingQuiz,
  userFormErrors,
  appFormErrors
});

export default createQuizPage;

import { push } from "react-router-redux";
export const SET_IS_SAVING_QUIZ = "SET_IS_SAVING_QUIZ";
export const SET_USER_FORM_ERRORS = "SET_USER_FORM_ERRORS";
export const SET_APP_FORM_ERRORS = "SET_APP_FORM_ERRORS";

export const setIsSavingQuiz = value => ({
  type: SET_IS_SAVING_QUIZ,
  value
});

export const setUserFormErrors = errors => ({
  type: SET_USER_FORM_ERRORS,
  errors
});

export const setAppFormErrors = errors => ({
  type: SET_APP_FORM_ERRORS,
  errors
});

export const saveQuiz = (quizData, path, firebase) => {
  return dispatch => {
    dispatch(setIsSavingQuiz(true));

    firebase
      .push(path, quizData)
      .then(() => {
        dispatch(setIsSavingQuiz(false));
        dispatch(push("/dashboard/quizzes"));
      })
      .catch(err => {
        dispatch(setIsSavingQuiz(false));
        dispatch(setAppFormErrors(err));
      });
  };
};

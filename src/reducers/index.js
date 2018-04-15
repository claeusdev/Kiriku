import { combineReducers } from 'redux';
import createQuizPage from './createQuizPage';

const on = (state = false, action) => {
  switch (action.type) {
    case 'SET_IS_SAVING_QUIZ':
      return action.value;
    default:
      return state;
  }
}

const reducer = combineReducers({
  on
});

export default reducer;

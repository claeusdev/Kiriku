import _ls from './localStorage';
import omit from 'lodash/omit';

const ROOT_STATE_KEY = 'OMGVOICE_QUIZZES';

export const loadFromLocalStorage = () => {
  let state = _ls.get(ROOT_STATE_KEY);

  if (!state) {
    return undefined;
  }

  // remove ephemeral values from state
  const stateWithoutEphemeralKeys = omit(state, [
    'app.createQuizPage.userFormErrors',
    'app.createQuizPage.appFormErrors',
    'app.createQuizPage.isSavingQuiz'
  ]);

  return stateWithoutEphemeralKeys; 
}

export const saveToLocalStorage = (state) => {
  _ls.set(ROOT_STATE_KEY, state);
}

const store = {
  loadFromLocalStorage,
  saveToLocalStorage
}

export default store;

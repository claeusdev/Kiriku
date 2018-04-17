import _ls from './localStorage';
import omit from 'lodash/omit';

const ROOT_STATE_KEY = 'APOLLO';

export const loadFromLocalStorage = () => {
  let state = _ls.get(ROOT_STATE_KEY);

  if (!state) {
    return undefined;
  }

  return state;
}

export const saveToLocalStorage = (state) => {
  _ls.set(ROOT_STATE_KEY, state);
}

const store = {
  loadFromLocalStorage,
  saveToLocalStorage
}

export default store;

export const get = (key, options) => {
  try {
    let item = localStorage.getItem(key);
    return JSON.parse(item);
  } catch (e) {
    return undefined;
  }
}

export const set = (key, value) => {
  try {
    let serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (e) {
    // Ignore write error
  }
}

export default {set, get}

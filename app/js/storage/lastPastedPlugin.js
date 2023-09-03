const KEY = "lastPastedPlugin";

/**
 *
 * @param {string} val
 */
export function saveLastPastedPlugin(val) {
  window.localStorage.setItem(KEY, val);
}

/**
 * @returns {?string}
 */
export function loadLastPastedPlugin() {
  return window.localStorage.getItem(KEY);
}

export function clearLastPastedPlugin() {
  window.localStorage.removeItem(KEY);
}

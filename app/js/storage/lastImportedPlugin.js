const KEY = "lastImportedPlugin";

/**
 *
 * @param {string} val
 */
export function saveLastImportedPlugin(val) {
  window.localStorage.setItem(KEY, val);
}

/**
 * @returns {?string}
 */
export function loadLastImportedPlugin() {
  return window.localStorage.getItem(KEY);
}

export function clearLastImportedPlugin() {
  window.localStorage.removeItem(KEY);
}

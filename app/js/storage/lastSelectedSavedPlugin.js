const KEY = "lastSelectedSavedPlugin";

/**
 *
 * @param {string} pluginName value from select element
 */
export function saveLastSelectedSavedPlugin(pluginName) {
  window.localStorage.setItem(KEY, pluginName);
}

/**
 * @returns {?string}
 */
export function loadLastSelectedSavedPlugin() {
  return window.localStorage.getItem(KEY);
}

export function clearLastSelectedSavedPlugin() {
  window.localStorage.removeItem(KEY);
}

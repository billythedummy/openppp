const KEY = "lastSelectedPluginSrc";

/** @typedef {"save" | "import" | "paste"} SelectedPluginSrc */

/**
 *
 * @param {SelectedPluginSrc} val
 */
export function saveLastSelectedPluginSrc(val) {
  window.localStorage.setItem(KEY, val);
}

/**
 * @returns {?SelectedPluginSrc}
 */
export function loadLastSelectedPluginSrc() {
  // @ts-ignore
  return window.localStorage.getItem(KEY);
}

export function clearLastSelectedPluginSrc() {
  window.localStorage.removeItem(KEY);
}

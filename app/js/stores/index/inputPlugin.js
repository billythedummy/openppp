/** @typedef {(oldVal: ?import("../../types").InputPlugin, newVal: ?import("../../types").InputPlugin) => void} OnInputPluginChangedCallback */

/** @type {?import("../../types").InputPlugin} */
let inputPlugin = null;

/** @type {Set<OnInputPluginChangedCallback>} */
const onInputPluginChangedCallbacks = new Set();

/**
 *
 * @param {import("../../types").InputPlugin} newPlugin
 */
export function setInputPlugin(newPlugin) {
  const oldVal = inputPlugin;
  inputPlugin = newPlugin;
  invokeOnChangeCbs(oldVal);
}

export function unsetInputPlugin() {
  const oldVal = inputPlugin;
  inputPlugin = null;
  invokeOnChangeCbs(oldVal);
}

/**
 *
 * @param {OnInputPluginChangedCallback} cb
 * @returns {() => void} off, function to unregister `cb`
 */
export function onInputPluginChanged(cb) {
  onInputPluginChangedCallbacks.add(cb);
  return () => {
    onInputPluginChangedCallbacks.delete(cb);
  };
}

/**
 *
 * @param {?import("../../types").InputPlugin} oldVal
 */
function invokeOnChangeCbs(oldVal) {
  for (const cb of onInputPluginChangedCallbacks) {
    cb(oldVal, inputPlugin);
  }
}

/**
 * @typedef SavedPlugin
 * @property {string} name
 * @property {string} plugin
 */

const PREFIX = "savedPlugin";

const ALL_KEY = "allSavedPlugins";

/** @type {Set<() => void>} */
const ALL_MUTATION_LISTENERS = new Set();

/**
 *
 * @param {string} pluginName
 */
function pluginStorageKey(pluginName) {
  return `${PREFIX}:${pluginName}`;
}

/**
 *
 * @param {() => void} callback
 * @returns {() => void} off() fn to unregister listener
 */
export function onSavedPluginsMutate(callback) {
  ALL_MUTATION_LISTENERS.add(callback);
  return () => {
    ALL_MUTATION_LISTENERS.delete(callback);
  };
}

function emitMutation() {
  for (const listener of ALL_MUTATION_LISTENERS) {
    try {
      listener();
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * @returns {string[]}
 */
export function loadAllSavedPluginNames() {
  const saved = window.localStorage.getItem(ALL_KEY);
  if (!saved) {
    return [];
  }
  return JSON.parse(saved);
}

/**
 *
 * @param {string[]} allPluginNames
 */
function saveAllSavedPluginNames(allPluginNames) {
  window.localStorage.setItem(ALL_KEY, JSON.stringify(allPluginNames));
}

/**
 *
 * @param {string} pluginName
 * @returns {string}
 */
export function loadSavedPlugin(pluginName) {
  return window.localStorage.getItem(pluginStorageKey(pluginName)) ?? "";
}

/**
 *
 * @param {string} originalPluginName
 */
export function deleteSavedPlugin(originalPluginName) {
  window.localStorage.removeItem(pluginStorageKey(originalPluginName));
  const newPluginNames = loadAllSavedPluginNames().filter(
    (name) => name !== originalPluginName
  );
  saveAllSavedPluginNames(newPluginNames);
  emitMutation();
}

/**
 *
 * @param {string} name
 * @returns {boolean}
 */
function isPluginNameUnique(name) {
  const names = loadAllSavedPluginNames();
  for (const existingName of names) {
    if (existingName === name) {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {SavedPlugin} plugin
 * @returns {{ err: string } | null} null if success, err with failure reason otherwise
 */
function verifyNonEmptyPlugin({ name, plugin }) {
  if (name.length === 0) {
    return { err: "plugin name cannot be empty" };
  }
  if (plugin.length === 0) {
    return { err: "plugin src cannot be empty" };
  }
  return null;
}

/**
 *
 * @param {SavedPlugin} newPlugin
 * @returns {{ err: string } | null} null if success, err with failure reason otherwise
 */
export function createSavedPlugin({ name, plugin }) {
  const ver = verifyNonEmptyPlugin({ name, plugin });
  if (ver !== null) {
    return ver;
  }
  if (!isPluginNameUnique(name)) {
    return { err: "plugin name already taken " };
  }
  const plugins = loadAllSavedPluginNames();
  plugins.push(name);
  saveAllSavedPluginNames(plugins);

  window.localStorage.setItem(pluginStorageKey(name), plugin);

  emitMutation();
  return null;
}

/**
 *
 * @param {string} originalPluginName
 * @param {SavedPlugin} updatedPlugin
 * @returns {{ err: string } | null} null if success, err with failure reason otherwise
 */
export function updateSavedPlugin(originalPluginName, { name, plugin }) {
  const ver = verifyNonEmptyPlugin({ name, plugin });
  if (ver !== null) {
    return ver;
  }
  if (originalPluginName !== name) {
    if (!isPluginNameUnique(name)) {
      return { err: "plugin name already taken " };
    }
    const pluginNames = loadAllSavedPluginNames();
    const i = pluginNames.indexOf(originalPluginName);
    if (i < 0) {
      return { err: "old plugin name not found" };
    }
    pluginNames[i] = name;
    saveAllSavedPluginNames(pluginNames);
    window.localStorage.removeItem(pluginStorageKey(originalPluginName));
  }

  window.localStorage.setItem(pluginStorageKey(name), plugin);

  emitMutation();
  return null;
}

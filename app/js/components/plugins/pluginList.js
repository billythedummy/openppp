import {
  loadAllSavedPluginNames,
  onSavedPluginsMutate,
} from "../../storage/savedPlugin";
import { createLoadedPluginDetails } from "./pluginDetails";

/** @type {HTMLOListElement} */ // @ts-ignore
const PLUGIN_LIST = document.getElementById("plugin-list");

function rerender() {
  // console.log("rerendering!");
  const pluginNames = loadAllSavedPluginNames();
  const liChildren = PLUGIN_LIST.children;

  const newPluginsToAppend = pluginNames.slice(liChildren.length);

  for (let i = 0; i < liChildren.length; i++) {
    const newPluginName = pluginNames[i];
    const existingLi = liChildren[i];
    /** @type {import("./pluginDetails").PluginDetails} */ // @ts-ignore
    const existingPlugin = existingLi.firstElementChild;
    if (!newPluginName) {
      for (let del = i; del < liChildren.length; del++) {
        PLUGIN_LIST.removeChild(liChildren[del]);
      }
      break;
    }

    // if names are the same, then value should be latest
    if (existingPlugin.originalName !== newPluginName) {
      existingLi.replaceChild(
        createLoadedPluginDetails(newPluginName),
        existingPlugin
      );
    }
  }

  for (const newPluginToAppend of newPluginsToAppend) {
    const newLi = document.createElement("li");
    newLi.appendChild(createLoadedPluginDetails(newPluginToAppend));
    PLUGIN_LIST.appendChild(newLi);
  }
}

onSavedPluginsMutate(rerender);

rerender();

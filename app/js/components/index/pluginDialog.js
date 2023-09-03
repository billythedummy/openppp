import {
  clearLastImportedPlugin,
  loadLastImportedPlugin,
  saveLastImportedPlugin,
} from "../../storage/lastImportedPlugin";
import {
  clearLastPastedPlugin,
  loadLastPastedPlugin,
  saveLastPastedPlugin,
} from "../../storage/lastPastedPlugin";
import {
  loadLastSelectedPluginSrc,
  saveLastSelectedPluginSrc,
} from "../../storage/lastSelectedPluginSrc";
import {
  setInputPlugin,
  unsetInputPlugin,
} from "../../stores/index/inputPlugin";
import { setupDialog } from "../../utils/dialog";

/** @type {HTMLDialogElement} */ // @ts-ignore
export const PLUGIN_DIALOG = document.getElementById("plugin-dialog");

/** @type {HTMLInputElement} */ // @ts-ignore
const SAVED_PLUGIN_RADIO = document.getElementById("saved-plugin-radio");

/** @type {HTMLInputElement} */ // @ts-ignore
const PASTE_PLUGIN_RADIO = document.getElementById("paste-plugin-radio");

/** @type {HTMLInputElement} */ // @ts-ignore
const IMPORT_PLUGIN_RADIO = document.getElementById("import-plugin-radio");

/** @type {HTMLSelectElement} */ // @ts-ignore
const SAVED_PLUGIN_SELECT = document.getElementById("saved-plugin-select");

/** @type {HTMLTextAreaElement} */ // @ts-ignore
const PASTE_PLUGIN_TEXTAREA = PLUGIN_DIALOG.querySelector("textarea");

/** @type {HTMLInputElement} */ // @ts-ignore
const IMPORT_PLUGIN_INPUT = document.getElementById("import-plugin-input");

/** @type {HTMLButtonElement} */ // @ts-ignore
const SAVE_BUTTON = PLUGIN_DIALOG.querySelector(`button[aria-label="save"]`);

/** @type {Record<import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc, HTMLInputElement>} */
const RADIOS = {
  save: SAVED_PLUGIN_RADIO,
  paste: PASTE_PLUGIN_RADIO,
  import: IMPORT_PLUGIN_RADIO,
};

const INPUTS = {
  save: SAVED_PLUGIN_SELECT,
  paste: PASTE_PLUGIN_TEXTAREA,
  import: IMPORT_PLUGIN_INPUT,
};

/** @type {Record<import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc, (pluginVal: string) => void>} */
const SAVES = {
  // TODO
  save: () => {},
  paste: saveLastPastedPlugin,
  import: saveLastImportedPlugin,
};

/** @type {Record<import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc, () => ?string>} */
const LOADS = {
  // TODO
  save: () => null,
  paste: loadLastPastedPlugin,
  import: loadLastImportedPlugin,
};

/** @type {Record<import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc, () => void>} */
const CLEARS = {
  // TODO
  save: () => {},
  paste: clearLastPastedPlugin,
  import: clearLastImportedPlugin,
};

// update and save config on dialog close
function update() {
  /** @type {import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc} */
  let selectedPluginSrc = "save";
  /** @type {?import("../../types").InputPlugin} */
  let inputPlugin = null;

  if (PASTE_PLUGIN_RADIO.checked) {
    selectedPluginSrc = "paste";
    const val = PASTE_PLUGIN_TEXTAREA.value;
    if (val) {
      inputPlugin = {
        ty: "rawString",
        val,
      };
    }
  } else if (IMPORT_PLUGIN_RADIO.checked) {
    selectedPluginSrc = "import";
    const val = IMPORT_PLUGIN_INPUT.value;
    if (val) {
      inputPlugin = {
        ty: "url",
        val,
      };
    }
  }
  // TODO: saved radio

  saveLastSelectedPluginSrc(selectedPluginSrc);
  if (inputPlugin) {
    setInputPlugin(inputPlugin);
    const saveFn = SAVES[selectedPluginSrc];
    saveFn(inputPlugin.val);
  } else {
    unsetInputPlugin();
    const clearFn = CLEARS[selectedPluginSrc];
    clearFn();
  }
}

function load() {
  for (const uncasted of ["save", "paste", "import"]) {
    /** @type {import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc} */ // @ts-ignore
    const src = uncasted;

    const loadFn = LOADS[src];
    const loadedVal = loadFn();
    if (loadedVal) {
      INPUTS[src].value = loadedVal;
    }
  }

  const loadedSrc = loadLastSelectedPluginSrc();
  if (loadedSrc) {
    setChecked(loadedSrc);
  }
  updateInputsEnabled();
  update();
}

/**
 *
 * @param {import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc} selectedSrc
 */
function setChecked(selectedSrc) {
  for (const [src, radio] of Object.entries(RADIOS)) {
    if (src === selectedSrc) {
      radio.checked = true;
    } else {
      radio.checked = false;
    }
  }
}

function updateInputsEnabled() {
  for (const uncasted of ["save", "paste", "import"]) {
    /** @type {import("../../storage/lastSelectedPluginSrc").SelectedPluginSrc} */ // @ts-ignore
    const src = uncasted;
    const radio = RADIOS[src];
    const input = INPUTS[src];
    if (radio.checked) {
      input.removeAttribute("disabled");
    } else {
      input.setAttribute("disabled", "1");
    }
  }
}

export function setupPluginDialog() {
  setupDialog(PLUGIN_DIALOG);

  load();

  SAVE_BUTTON.onclick = () => {
    update();
    PLUGIN_DIALOG.close();
  };
  for (const radio of Object.values(RADIOS)) {
    radio.onchange = updateInputsEnabled;
  }
}

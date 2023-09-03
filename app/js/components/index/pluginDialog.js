import {
  setInputPlugin,
  unsetInputPlugin,
} from "../../stores/index/inputPlugin";
import { setupDialog } from "../../utils/dialog";

/** @type {HTMLDialogElement} */ // @ts-ignore
export const PLUGIN_DIALOG = document.getElementById("plugin-dialog");

/** @type {HTMLInputElement} */ // @ts-ignore
const PASTE_PLUGIN_RADIO = document.getElementById("paste-plugin-radio");

/** @type {HTMLTextAreaElement} */ // @ts-ignore
const TEXTAREA = PLUGIN_DIALOG.querySelector("textarea");

/** @type {HTMLButtonElement} */ // @ts-ignore
const SAVE_BUTTON = PLUGIN_DIALOG.querySelector(`button[aria-label="save"]`);

function save() {
  // TODO: other 2 radios and types
  if (PASTE_PLUGIN_RADIO.checked) {
    const val = TEXTAREA.value;
    if (val) {
      setInputPlugin({
        ty: "rawString",
        val,
      });
    } else {
      unsetInputPlugin();
    }
  }
}

export function setupPluginDialog() {
  setupDialog(PLUGIN_DIALOG);
  SAVE_BUTTON.onclick = () => {
    save();
    PLUGIN_DIALOG.close();
  };
}

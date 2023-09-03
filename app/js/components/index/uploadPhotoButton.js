import { runInputPlugin } from "../../core";
import { setImgFile } from "../../stores/index/imgFile";
import {
  getInputPlugin,
  onInputPluginChanged,
} from "../../stores/index/inputPlugin";
import { BLACK_RGB, GRAY_300_RGB } from "../../utils/consts";
import { toggleBtnEnabledOnInputPluginChanged } from "../../utils/inputPlugin";
import { setStopColor } from "../../utils/svg";

/** @type {HTMLButtonElement} */ // @ts-ignore
const UPLOAD_PHOTO_BTN = document.getElementById("upload-photo-button");

/** @type {SVGLinearGradientElement} */ // @ts-ignore
const UPLOAD_PHOTO_ICON_FILL = document.getElementById(
  "upload-photo-icon-fill"
);

/**
 *
 * @returns {HTMLInputElement}
 */
function createFileInput() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";
  return input;
}

/**
 * Fired when document.body gets focus back
 * @param {HTMLInputElement} fileInput
 * @returns {() => void}
 */
function onFileInputClosedHandler(fileInput) {
  const closure = () => {
    cleanupFileInputListeners(fileInput, closure);
    document.body.removeChild(fileInput);
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const imgFile = fileInput.files[0];
    setImgFile(imgFile);
    const inputPlugin = getInputPlugin();
    if (!inputPlugin) {
      throw new Error("No plugin defined");
    }
    runInputPlugin(inputPlugin);
  };
  return closure;
}

/**
 * Registers all event listeners that runs the plugin and cleans up `fileInput`
 * when the file input is closed.
 * @param {HTMLInputElement} fileInput
 * @param {() => void} onFileInputClosed
 */
function setupFileInputListeners(fileInput, onFileInputClosed) {
  fileInput.oninput = onFileInputClosed;
  document.body.addEventListener("focus", onFileInputClosed);
  // firefox does not fire focus event when file input is closed;
  // as a workaround, we clean up fileInput when button regains focus
  UPLOAD_PHOTO_BTN.addEventListener("focus", onFileInputClosed);
}

/**
 * Unregister all event listeners waiting for fileInput to close
 * so that `closure` doesnt run twice
 * @param {HTMLInputElement} fileInput
 * @param {() => void} onFileInputClosed
 */
function cleanupFileInputListeners(fileInput, onFileInputClosed) {
  fileInput.oninput = null;
  document.body.removeEventListener("focus", onFileInputClosed);
  UPLOAD_PHOTO_BTN.removeEventListener("focus", onFileInputClosed);
}

function openFileSelect() {
  const fileInput = createFileInput();
  const onFileInputClosed = onFileInputClosedHandler(fileInput);
  setupFileInputListeners(fileInput, onFileInputClosed);
  document.body.appendChild(fileInput);
  fileInput.click();
}

export function setupUploadPhotoBtn() {
  const toggleCb = toggleBtnEnabledOnInputPluginChanged(UPLOAD_PHOTO_BTN);
  onInputPluginChanged((oldVal, newVal) => {
    toggleCb(oldVal, newVal);
    setStopColor(
      UPLOAD_PHOTO_ICON_FILL,
      newVal === null ? GRAY_300_RGB : BLACK_RGB
    );
  });
  UPLOAD_PHOTO_BTN.onclick = openFileSelect;
}

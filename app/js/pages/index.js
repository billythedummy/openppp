import { defineOpenpppSidebar } from "../components/common/sidebar";
import {
  PLUGIN_DIALOG,
  setupPluginDialog,
} from "../components/index/pluginDialog";
import { setupTakePhotoBtn } from "../components/index/takePhotoButton";
import { setupUploadPhotoBtn } from "../components/index/uploadPhotoButton";
import { onInputPluginChanged } from "../stores/index/inputPlugin";
import { setupDialog } from "../utils/dialog";

/** @type {MediaStreamConstraints} */
const VID_CONSTRAINTS = {
  video: true,
};

/** @type {HTMLButtonElement} */ // @ts-ignore
const HELP_BTN = document.getElementById("help-button");

/** @type {HTMLButtonElement} */ // @ts-ignore
const CONFIGURE_PLUGIN_BTN = document.getElementById("configure-plugin-button");

/** @type {SVGElement} */ // @ts-ignore
const SCRIPT_ICON_FILL = document.getElementById("script-icon-fill");

/** @type {HTMLDialogElement} */ // @ts-ignore
const HELP_DIALOG = document.getElementById("help-dialog");

async function startLiveVideoFeed() {
  /** @type {HTMLVideoElement} */
  // @ts-ignore
  const videoElement = document.querySelector("video");
  const stream = await window.navigator.mediaDevices.getUserMedia(
    VID_CONSTRAINTS
  );
  videoElement.srcObject = stream;
}

function setupHelpBtn() {
  HELP_BTN.onclick = () => {
    HELP_DIALOG.showModal();
  };
}

function setupHelpDialog() {
  setupDialog(HELP_DIALOG);
}

function setupConfigurePluginBtn() {
  CONFIGURE_PLUGIN_BTN.onclick = () => {
    PLUGIN_DIALOG.showModal();
  };
  onInputPluginChanged((_, newVal) => {
    if (newVal === null) {
      SCRIPT_ICON_FILL.setAttribute("fill", "#FF0000");
    } else {
      SCRIPT_ICON_FILL.setAttribute("fill", "#00FF00");
    }
  });
}

// on page parsed:

defineOpenpppSidebar();
startLiveVideoFeed();
setupTakePhotoBtn();
setupUploadPhotoBtn();
setupConfigurePluginBtn();
setupPluginDialog();
setupHelpBtn();
setupHelpDialog();

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
  video: {
    facingMode: "user",
  },
};

/** @type {HTMLButtonElement} */ // @ts-ignore
const HELP_BTN = document.getElementById("help-button");

/** @type {HTMLButtonElement} */ // @ts-ignore
const TOGGLE_CAMERA_BTN = document.getElementById("toggle-camera-button");

/** @type {HTMLButtonElement} */ // @ts-ignore
const CONFIGURE_PLUGIN_BTN = document.getElementById("configure-plugin-button");

/** @type {SVGElement} */ // @ts-ignore
const SCRIPT_ICON_FILL = document.getElementById("script-icon-fill");

/** @type {HTMLDialogElement} */ // @ts-ignore
const HELP_DIALOG = document.getElementById("help-dialog");

/** @type {HTMLVideoElement} */ // @ts-ignore
const VIDEO_ELEM = document.querySelector("video");

function toggleCamera() {
  const newFacingMode =
    // @ts-ignore
    VID_CONSTRAINTS.video.facingMode === "user" ? "environment" : "user";
  // @ts-ignore
  VID_CONSTRAINTS.video.facingMode = newFacingMode;
  restartLiveVideoFeed();
}

async function restartLiveVideoFeed() {
  const stream = await window.navigator.mediaDevices.getUserMedia(
    VID_CONSTRAINTS
  );
  VIDEO_ELEM.srcObject = stream;
}

function setupHelpBtn() {
  HELP_BTN.onclick = () => {
    HELP_DIALOG.showModal();
  };
}

function setupHelpDialog() {
  setupDialog(HELP_DIALOG);
}

// aesthetics and showModal only
function setupConfigurePluginBtn() {
  CONFIGURE_PLUGIN_BTN.onclick = () => {
    PLUGIN_DIALOG.showModal();
  };
  onInputPluginChanged((_, newVal) => {
    if (newVal === null) {
      // red
      SCRIPT_ICON_FILL.setAttribute("fill", "#FF0000");
    } else {
      // green
      SCRIPT_ICON_FILL.setAttribute("fill", "#00FF00");
    }
  });
}

function setupToggleCameraButton() {
  TOGGLE_CAMERA_BTN.onclick = toggleCamera;
}

// on page parsed:

defineOpenpppSidebar();
restartLiveVideoFeed();
setupTakePhotoBtn();
setupUploadPhotoBtn();
setupConfigurePluginBtn();
setupHelpBtn();
setupHelpDialog();
setupToggleCameraButton();

// must be last since load() might
// setInputPlugin() so other listeners should be registered prior
setupPluginDialog();

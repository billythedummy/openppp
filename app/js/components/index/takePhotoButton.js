import { runInputPlugin, setGlobalImgFile } from "../../core";
import {
  getInputPlugin,
  onInputPluginChanged,
} from "../../stores/index/inputPlugin";
import { BLACK_RGB, GRAY_300_RGB } from "../../utils/consts";
import { toggleBtnEnabledOnInputPluginChanged } from "../../utils/inputPlugin";
import { setStopColor } from "../../utils/svg";

/** @type {HTMLButtonElement} */ // @ts-ignore
const TAKE_PHOTO_BTN = document.getElementById("take-photo-button");

/** @type {SVGLinearGradientElement} */ // @ts-ignore
const CAMERA_ICON_FILL = document.getElementById("camera-icon-fill");

function takePhotoRunPlugin() {
  const canvas = document.createElement("canvas");
  /** @type {HTMLVideoElement} */ // @ts-ignore
  const videoElement = document.querySelector("video");

  const videoDims = videoElement.getBoundingClientRect();
  canvas.width = videoDims.width;
  canvas.height = videoDims.height;

  /** @type {CanvasRenderingContext2D} */ // @ts-ignore
  const context = canvas.getContext("2d");
  context.drawImage(videoElement, 0, 0, videoDims.width, videoDims.height);

  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error("canvas.toBlob() failed");
    }
    const imgFile = new File([blob], `capture-${Date.now()}.png`);
    setGlobalImgFile(imgFile);
    const inputPlugin = getInputPlugin();
    if (!inputPlugin) {
      throw new Error("No plugin defined");
    }
    runInputPlugin(inputPlugin);
  });
}

export function setupTakePhotoBtn() {
  const toggleCb = toggleBtnEnabledOnInputPluginChanged(TAKE_PHOTO_BTN);
  onInputPluginChanged((oldVal, newVal) => {
    toggleCb(oldVal, newVal);
    setStopColor(CAMERA_ICON_FILL, newVal === null ? GRAY_300_RGB : BLACK_RGB);
  });
  TAKE_PHOTO_BTN.onclick = takePhotoRunPlugin;
}

import { onInputPluginChanged } from "../../stores/index/inputPlugin";
import { BLACK_RGB, GRAY_300_RGB } from "../../utils/consts";
import { toggleBtnEnabledOnInputPluginChanged } from "../../utils/inputPlugin";
import { setStopColor } from "../../utils/svg";

/** @type {HTMLButtonElement} */ // @ts-ignore
const TAKE_PHOTO_BTN = document.getElementById("take-photo-button");

/** @type {SVGLinearGradientElement} */ // @ts-ignore
const CAMERA_ICON_FILL = document.getElementById("camera-icon-fill");

export function setupTakePhotoBtn() {
  const toggleCb = toggleBtnEnabledOnInputPluginChanged(TAKE_PHOTO_BTN);
  onInputPluginChanged((oldVal, newVal) => {
    toggleCb(oldVal, newVal);
    setStopColor(CAMERA_ICON_FILL, newVal === null ? GRAY_300_RGB : BLACK_RGB);
  });
}

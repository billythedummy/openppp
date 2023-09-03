import { onInputPluginChanged } from "../../stores/index/inputPlugin";
import { BLACK_RGB, GRAY_300_RGB } from "../../utils/consts";
import { toggleBtnEnabledOnInputPluginChanged } from "../../utils/inputPlugin";
import { setStopColor } from "../../utils/svg";

/** @type {HTMLButtonElement} */ // @ts-ignore
const UPLOAD_PHOTO_BTN = document.getElementById("upload-photo-button");

/** @type {SVGLinearGradientElement} */ // @ts-ignore
const UPLOAD_PHOTO_ICON_FILL = document.getElementById(
  "upload-photo-icon-fill"
);

export function setupUploadPhotoBtn() {
  const toggleCb = toggleBtnEnabledOnInputPluginChanged(UPLOAD_PHOTO_BTN);
  onInputPluginChanged((oldVal, newVal) => {
    toggleCb(oldVal, newVal);
    setStopColor(
      UPLOAD_PHOTO_ICON_FILL,
      newVal === null ? GRAY_300_RGB : BLACK_RGB
    );
  });
}

/** @type {HTMLButtonElement} */ // @ts-ignore
const CLOSE_PREVIEW_BTN = document.getElementById("close-preview-button");

/** @type {HTMLCanvasElement} */ // @ts-ignore
const PREVIEW_CANVAS = document.getElementById("preview-canvas");

export const PREVIEW_HIDDEN_EVENT_TYPE = "openppp-app:preview-hidden";

export const PREVIEW_SHOWN_EVENT_TYPE = "openppp-app:preview-shown";

/**
 *
 * @param {Blob} imgBlob
 */
export async function drawAndShowPreview(imgBlob) {
  const imgBitmap = await createImageBitmap(imgBlob);
  /** @type {CanvasRenderingContext2D} */ // @ts-ignore
  const ctx = PREVIEW_CANVAS.getContext("2d");
  // TODO: maybe preserve image's aspect ratio
  // instead of making it stretch to fill canvas
  PREVIEW_CANVAS.width = imgBitmap.width;
  PREVIEW_CANVAS.height = imgBitmap.height;
  ctx.drawImage(imgBitmap, 0, 0, imgBitmap.width, imgBitmap.height);
  showPreview();
}

export function setupClosePreviewButton() {
  CLOSE_PREVIEW_BTN.onclick = hidePreview;
}

/**
 * TODO: save callbacks and add onPreviewShown() if required
 * @param {() => void} callback
 */
export function onPreviewShown(callback) {
  PREVIEW_CANVAS.addEventListener(PREVIEW_SHOWN_EVENT_TYPE, callback);
}

/**
 * TODO: save callbacks and add onPreviewShown() if required
 * @param {() => void} callback
 */
export function onPreviewHidden(callback) {
  PREVIEW_CANVAS.addEventListener(PREVIEW_HIDDEN_EVENT_TYPE, callback);
}

function showPreview() {
  PREVIEW_CANVAS.classList.remove("invisible");
  CLOSE_PREVIEW_BTN.classList.remove("invisible");
  PREVIEW_CANVAS.dispatchEvent(new CustomEvent(PREVIEW_SHOWN_EVENT_TYPE));
}

function hidePreview() {
  PREVIEW_CANVAS.classList.add("invisible");
  CLOSE_PREVIEW_BTN.classList.add("invisible");
  PREVIEW_CANVAS.dispatchEvent(new CustomEvent(PREVIEW_HIDDEN_EVENT_TYPE));
}

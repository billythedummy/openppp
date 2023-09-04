/** @type {HTMLButtonElement} */ // @ts-ignore
const CLOSE_PREVIEW_BTN = document.getElementById("close-preview-button");

/** @type {HTMLCanvasElement} */ // @ts-ignore
const PREVIEW_CANVAS = document.getElementById("preview-canvas");

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

function showPreview() {
  PREVIEW_CANVAS.classList.remove("invisible");
  CLOSE_PREVIEW_BTN.classList.remove("invisible");
}

function hidePreview() {
  PREVIEW_CANVAS.classList.add("invisible");
  CLOSE_PREVIEW_BTN.classList.add("invisible");
}

export function setupClosePreviewButton() {
  CLOSE_PREVIEW_BTN.onclick = hidePreview;
}

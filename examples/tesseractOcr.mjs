/* eslint-disable */

/**
 * This plugin performs otsu binarization using the `otsu` npm package
 * and then performs OCR on the image using tesseract.js
 * and then alert()s the output string
 *
 * Note: tesseract's accuracy is pretty poor unless the image is in perfect black-n-white condition,
 * probably gonna have to do more pre-processing than just otsu binarizing it
 */

// would've been nice to use opencv for pre-processing but:
// - the official vers doesnt work in strict mode due to use of `Module` var before defining
// - @techstark/opencv-js 's esm/cjs cdn dist dont work, maybe it only works with bundlers
// import * as cv from "https://cdn.jsdelivr.net/npm/opencv.js@1.2.1/opencv.min.js";

// @ts-ignore
import tesseract from "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.esm.min.js";
// @ts-ignore
// otsu = { default: () => ..., __esmodule: true } for some reason
import otsu from "https://cdn.jsdelivr.net/npm/otsu@0.0.5/+esm";

/**
 * Because tesseract only takes blob input
 * @param {Blob} blob
 * @returns {Promise<ImageData>}
 */
async function blobToImageData(blob) {
  const imgBitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = imgBitmap.width;
  canvas.height = imgBitmap.height;
  /** @type {CanvasRenderingContext2D} */ // @ts-ignore
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 *
 * @param {Uint8ClampedArray} rgba
 * @returns {Uint8ClampedArray}
 */
function rgbaToGray(rgba) {
  const size = rgba.length / 4;
  const gray = new Uint8ClampedArray(size);
  for (let i = 0; i < rgba.length; i += 4) {
    const j = i / 4;
    // average of RGB * A
    const aMult = rgba[i + 3] / 255;
    gray[j] = Math.floor((aMult * (rgba[i] + rgba[i + 1] + rgba[i + 2])) / 3);
  }
  return gray;
}

/**
 *
 * @param {Uint8ClampedArray} gray
 * @returns {Uint8ClampedArray}
 */
function grayToRgba(gray) {
  const size = gray.length * 4;
  const rgba = new Uint8ClampedArray(size);
  for (let i = 0; i < gray.length; i++) {
    const val = gray[i];
    rgba[4 * i] = val;
    rgba[4 * i + 1] = val;
    rgba[4 * i + 2] = val;
    rgba[4 * i + 3] = 255;
  }
  return rgba;
}

/**
 * Because tesseract only takes blob input
 * @param {ImageData} imageData
 * @returns {Promise<Blob>}
 */
function imageDataToBlob(imageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  // @ts-ignore
  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject("failed toBlob");
        return;
      }
      resolve(blob);
    });
  });
}

/** @type {OpenPPPHandler} */
async function tesseractOcr(image) {
  const imageData = await blobToImageData(image);
  const gray = rgbaToGray(imageData.data);
  /** @type {number} */
  const threshold = otsu.default(gray);
  const bnw = gray.map((v) => (v > threshold ? 255 : 0));
  const bnwProcessed = grayToRgba(bnw);
  const imageDataPost = new ImageData(bnwProcessed, imageData.width);
  const tesseractInput = await imageDataToBlob(imageDataPost);

  const worker = await tesseract.createWorker({
    logger: (m) => console.log("TESSERACT:", m),
  });
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  await worker.setParameters({
    tessedit_pageseg_mode: "1",
  });
  const {
    data: { text },
  } = await worker.recognize(tesseractInput);
  await worker.terminate();

  alert(text);
}

window.dispatchEvent(
  new CustomEvent("openppp:handler-ready", { detail: tesseractOcr })
);

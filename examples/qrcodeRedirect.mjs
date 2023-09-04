/* eslint-disable */

/**
 * This plugin scans a QR code image and navigates to the URL string it decodes to.
 *
 * Note: qr-scanner's QrScanner.scanImage doesn't seem to do much image pre-processing before attemping to scan
 * e.g. skew correction, cropping
 * so this'll probably only work if you upload a proper QR code instead of taking a photo of one
 */

// @ts-ignore
import QrScanner from "https://unpkg.com/qr-scanner@1.4.2/qr-scanner.min.js";

/** @type {OpenPPPHandler} */
async function qrcodeRedirect(image) {
  const urlString = await QrScanner.scanImage(image);
  if (urlString) {
    window.location.href = urlString;
  } else {
    alert("failed to scan QR code");
  }
}

window.dispatchEvent(
  new CustomEvent("openppp:handler-ready", { detail: qrcodeRedirect })
);

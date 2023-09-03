/**
 * This plugin scans a QR code in the image and navigates to the URL string it decodes to
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

// @ts-ignore
window.openPPPHandler = qrcodeRedirect;
window.dispatchEvent(new CustomEvent("openppp:handler-ready"));

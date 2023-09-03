/**
 * This plugin simply console.logs the File object
 */

/** @type {OpenPPPHandler} */
async function consoleLog(image) {
  console.log(image);
}

// @ts-ignore
window.openPPPHandler = consoleLog;
window.dispatchEvent(new CustomEvent("openppp:handler-ready"));

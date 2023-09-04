/**
 * This plugin (re-)downloads the captured image
 */

/** @type {OpenPPPHandler} */
async function saveImg(image) {
  const aElem = document.createElement("a");
  aElem.setAttribute("href", URL.createObjectURL(image));
  aElem.setAttribute("download", image.name);

  aElem.style.display = "none";
  document.body.appendChild(aElem);

  aElem.click();

  document.body.removeChild(aElem);
}

window.dispatchEvent(
  new CustomEvent("openppp:handler-ready", { detail: saveImg })
);

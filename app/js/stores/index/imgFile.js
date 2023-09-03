/** @type {?File} */
let imgFile = null;

/**
 *
 * @param {File} file
 */
export function setImgFile(file) {
  imgFile = file;
}

export function unsetImgFile() {
  imgFile = null;
}

/**
 *
 * @returns {?File}
 */
export function getImgFile() {
  return imgFile;
}

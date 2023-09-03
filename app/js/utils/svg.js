/**
 *
 * @param {SVGLinearGradientElement} linearGradient
 * @param {string} color
 */
export function setStopColor(linearGradient, color) {
  /** @type {SVGStopElement} */ // @ts-ignore
  const stop = linearGradient.querySelector("stop");
  stop.setAttribute("stop-color", color);
}

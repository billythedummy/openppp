/**
 *
 * @param {HTMLButtonElement} btn
 * @returns {import("../stores/index/inputPlugin").OnInputPluginChangedCallback}
 */
export function toggleBtnEnabledOnInputPluginChanged(btn) {
  return (_, newVal) => {
    if (newVal === null) {
      btn.disabled = true;
    } else {
      btn.removeAttribute("disabled");
    }
  };
}

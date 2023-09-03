/**
 * @param {string} [id]
 * @returns {HTMLScriptElement}
 */
export function createModuleScriptTag(id) {
  const script = document.createElement("script");
  script.setAttribute("type", "module");
  if (id) {
    script.id = id;
  }
  return script;
}

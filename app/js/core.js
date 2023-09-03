import { createModuleScriptTag } from "./utils/dom";

const HANDLER_MODULE_SCRIPT_ID = "openppphandlermodulescript";
const EXEC_MODULE_SCRIPT_ID = "openpppexecmodulescript";

/**
 *
 * @param {import("./types").InputPlugin} inputPlugin
 */
export function runInputPlugin(inputPlugin) {
  const handlerModule = createModuleScriptTag(HANDLER_MODULE_SCRIPT_ID);
  if (inputPlugin.ty === "url") {
    handlerModule.src = inputPlugin.val;
  } else {
    handlerModule.innerHTML = inputPlugin.val;
  }
  document.body.appendChild(handlerModule);

  const execModule = createModuleScriptTag(EXEC_MODULE_SCRIPT_ID);
  execModule.innerHTML = `
    async function run() {
      const imgFile = window.openPPPFile;
      if (!imgFile) {
        throw new Error("window.openPPPFile undefined");
      }
      const handler = window.openPPPHandler;
      if (!handler) {
        throw new Error("window.openPPPHandler undefined");
      }

      await handler(imgFile);

      window.openPPPFile = undefined;
      window.openPPPHandler = undefined;
    }

    run().finally(() => {
      document.body.removeChild(document.getElementById("${HANDLER_MODULE_SCRIPT_ID}"));
      document.body.removeChild(document.getElementById("${EXEC_MODULE_SCRIPT_ID}"));
    });
  `;
  document.body.appendChild(execModule);
}

/**
 *
 * @param {File} imgFile
 */
export function setGlobalImgFile(imgFile) {
  // @ts-ignore
  window.openPPPFile = imgFile;
}

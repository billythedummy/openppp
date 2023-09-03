import { getImgFile, unsetImgFile } from "./stores/index/imgFile";
import { createModuleScriptTag } from "./utils/dom";

const HANDLER_MODULE_SCRIPT_ID = "openppphandlermodulescript";
const HANDLER_READY_EVENT_NAME = "openppp:handler-ready";

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

  const run = async () => {
    try {
      // @ts-ignore
      const imgFile = getImgFile();
      if (!imgFile) {
        throw new Error("imgFile undefined");
      }
      // @ts-ignore
      const handler = window.openPPPHandler;
      if (!handler) {
        throw new Error("window.openPPPHandler undefined");
      }

      await handler(imgFile);
    } finally {
      unsetImgFile();
      window.removeEventListener(HANDLER_READY_EVENT_NAME, run);
      // @ts-ignore
      window.openPPPFile = undefined;
      // @ts-ignore
      window.openPPPHandler = undefined;
      document.body.removeChild(handlerModule);
    }
  };

  window.addEventListener(HANDLER_READY_EVENT_NAME, run);
  document.body.appendChild(handlerModule);
}

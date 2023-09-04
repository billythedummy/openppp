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

  /** @type {EventListener} */
  const run = async (event) => {
    try {
      /** @type {OpenPPPHandlerReadyEvent} */ // @ts-ignore
      const { detail } = event;
      const imgFile = getImgFile();
      if (!imgFile) {
        throw new Error("imgFile undefined");
      }
      await detail(imgFile);
    } finally {
      unsetImgFile();
      window.removeEventListener(HANDLER_READY_EVENT_NAME, run);
      document.body.removeChild(handlerModule);
    }
  };

  window.addEventListener(HANDLER_READY_EVENT_NAME, run);
  document.body.appendChild(handlerModule);
}

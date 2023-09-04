import { getImgFile, unsetImgFile } from "./stores/index/imgFile";
import { createModuleScriptTag } from "./utils/dom";

const HANDLER_MODULE_SCRIPT_ID = "openppphandlermodulescript";
const HANDLER_READY_EVENT_NAME = "openppp:handler-ready";

/** @type {Set<EventListener>} */
const HANDLER_READY_EVENT_LISTENERS = new Set();

/**
 *
 * @param {EventListener} listener
 */
function addHandlerReadyEventListener(listener) {
  window.addEventListener(HANDLER_READY_EVENT_NAME, listener);
  HANDLER_READY_EVENT_LISTENERS.add(listener);
}

function clearHandlerReadyEventListeners() {
  for (const listener of HANDLER_READY_EVENT_LISTENERS) {
    window.removeEventListener(HANDLER_READY_EVENT_NAME, listener);
  }
  HANDLER_READY_EVENT_LISTENERS.clear();
}

/**
 *
 * @param {import("./types").InputPlugin} inputPlugin
 */
export function runInputPlugin(inputPlugin) {
  // cleanup any previous listeners that might not've cleaned up due to throws
  clearHandlerReadyEventListeners();

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
      clearHandlerReadyEventListeners();
      document.body.removeChild(handlerModule);
    }
  };

  addHandlerReadyEventListener(run);

  document.body.appendChild(handlerModule);
}

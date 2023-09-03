import { ATTR_ONLY_OBSERVER_OPTIONS } from "./consts";

const MUTATION_OBSERVER = new MutationObserver(onDialogAttrMutation);

/**
 * Attach MUTATION_OBSERVER to observe dialog's `open` attribute
 * @param {HTMLDialogElement} dialog
 */
export function setupDialog(dialog) {
  MUTATION_OBSERVER.observe(dialog, ATTR_ONLY_OBSERVER_OPTIONS);
}

/**
 *
 * @param {MutationRecord[]} mutationRecords
 */
function onDialogAttrMutation(mutationRecords) {
  for (const record of mutationRecords) {
    if (record.attributeName && record.attributeName === "open") {
      /** @type {HTMLDialogElement} */
      // @ts-ignore
      const dialog = record.target;
      if (dialog.open) {
        onOpen(dialog);
      }
    }
  }
}

/**
 * Adds:
 * - window listener to close dialog if anywhere outside dialog is clicked
 * - dialog close onclick to button in dialog with close aria-label
 * @param {HTMLDialogElement} dialog
 */
function onOpen(dialog) {
  const clickToCloseWindowListener = createClickToCloseWindowListener(dialog);
  window.addEventListener("click", clickToCloseWindowListener);
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const closeBtn = dialog.querySelector(`button[aria-label="close"]`);
  closeBtn.onclick = closeButtonOnClickListener;
  dialog.onclose = createOnCloseListener(clickToCloseWindowListener);
}

/**
 * @param {(e: MouseEvent) => void} clickToCloseWindowListener
 * @returns {() => void}
 */
function createOnCloseListener(clickToCloseWindowListener) {
  return () => {
    window.removeEventListener("click", clickToCloseWindowListener);
  };
}

/**
 *
 * @param {HTMLDialogElement} dialog
 * @returns {(e: MouseEvent) => void}
 */
function createClickToCloseWindowListener(dialog) {
  return (event) => {
    if (event.target && event.target === dialog) {
      dialog.close();
    }
  };
}

/**
 *
 * @param {MouseEvent} event
 */
function closeButtonOnClickListener(event) {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const button = event.target;
  const parentDialog = button.closest("dialog");
  if (!parentDialog) {
    throw new Error(`button ${button} has no containing dialog`);
  }
  parentDialog.close();
}

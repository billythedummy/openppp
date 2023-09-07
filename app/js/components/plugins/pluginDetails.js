import {
  createSavedPlugin,
  deleteSavedPlugin,
  loadSavedPlugin,
  updateSavedPlugin,
} from "../../storage/savedPlugin";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = `
<details class="rounded-container p-4 h-full w-full">
  <summary class="relative align-middle text-lg text-truncate whitespace-nowrap overflow-x-scroll">
    Create A New Plugin
    <button aria-label="edit" class="icon-button h-8 inline" type="button">
      <img
        class="h-full"
        src="/images/icons/edit.svg"
        alt="edit plugin name"
      />
    </button>
    <button aria-label="delete" class="icon-button h-8 inline" type="button" >
      <img
        class="h-full"
        src="/images/icons/trash.svg"
        alt="delete plugin"
      />
    </button>
    <input type="text" class="invisible absolute left-0 h-full"/>
  </summary>
  <textarea rows="10" class="w-full my-2"></textarea>
  <button class="text-button w-full" type="button">save</button>
</details>
`;

export class PluginDetails extends HTMLElement {
  /** @returns {HTMLButtonElement} */
  get #editNameButton() {
    // @ts-ignore
    return this.querySelector(`button[aria-label="edit"]`);
  }

  /** @returns {HTMLButtonElement} */
  get #deleteButton() {
    // @ts-ignore
    return this.querySelector(`button[aria-label="delete"]`);
  }

  /** @returns {HTMLButtonElement} */
  get #saveButton() {
    // @ts-ignore
    return this.querySelector("button.text-button");
  }

  /** @returns {HTMLInputElement} */
  get #input() {
    // @ts-ignore
    return this.querySelector("input");
  }

  /** @returns {HTMLElement} */
  get #summary() {
    // @ts-ignore
    return this.querySelector("summary");
  }

  /** @returns {Text} */
  get #summaryTextNode() {
    // @ts-ignore
    return this.#summary.firstChild;
  }

  /** @returns {HTMLTextAreaElement} */
  get #textarea() {
    // @ts-ignore
    return this.querySelector("textarea");
  }

  /** @returns {string} */
  get originalName() {
    return this.getAttribute("original-name") ?? "";
  }

  /** @returns {boolean} */
  get #isCreate() {
    return this.originalName.length === 0;
  }

  /** @returns {string} */
  get pluginName() {
    return this.#summary.innerText.trim();
  }

  /** @returns {string} */
  get plugin() {
    return this.#textarea.value.trim();
  }

  constructor() {
    super();
    /** @type {HTMLDetailsElement} */ // @ts-ignore
    const details = TEMPLATE.content.firstElementChild.cloneNode(true);
    this.appendChild(details);
    if (this.#isCreate) {
      this.#summary.removeChild(this.#deleteButton);

      this.#saveButton.onclick = () => {
        const res = createSavedPlugin({
          name: this.pluginName,
          plugin: this.plugin,
        });
        if (res !== null) {
          alert(res.err);
          return;
        }
        this.#textarea.value = "";
        this.#summaryTextNode.nodeValue = "Create A New Plugin";
      };
    } else {
      this.#summaryTextNode.nodeValue = this.originalName;
      const savedPlugin = loadSavedPlugin(this.originalName);
      this.#textarea.value = savedPlugin;

      this.#saveButton.onclick = () => updatePlugin(this);
      this.#deleteButton.onclick = () => {
        if (window.confirm("Delete plugin?")) {
          deleteSavedPlugin(this.originalName);
        }
      };
    }

    this.#input.onblur = () => {
      this.#summaryTextNode.nodeValue = this.#input.value;
      this.#input.classList.add("invisible");
      if (!this.#isCreate) {
        updatePlugin(this);
      }
    };

    this.#input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.#input.blur();
      }
    });

    this.#editNameButton.onclick = () => {
      this.#input.classList.remove("invisible");
      this.#input.value = this.pluginName;
      this.#input.focus();
    };
  }
}

/**
 *
 * @param {PluginDetails} pluginDetails
 */
function updatePlugin({ pluginName: name, plugin, originalName }) {
  const res = updateSavedPlugin(originalName, { name, plugin });
  if (res !== null) {
    alert(res.err);
  }
}

/**
 *
 * @param {string} pluginName
 * @returns {PluginDetails}
 */
export function createLoadedPluginDetails(pluginName) {
  // doing it like this bec attributes are parsed in constructor
  // so we cant do new PluginDetails()
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = `<plugin-details original-name="${pluginName}"></plugin-details>`;
  // @ts-ignore
  return tempDiv.firstElementChild;
}

window.customElements.define("plugin-details", PluginDetails);

// eslint-disable-next-line import/extensions
import "msc-sidebar/mjs/wc-msc-sidebar.js";

const INNER_HTML = `
  <button class="icon-button h-full w-full">
    <svg class="h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>open sidebar menu</title>
      <path d="M4 18L20 18" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
      <path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
      <path d="M4 6L20 6" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
  <msc-sidebar>
    <nav class="bg-white h-full p-2 flex flex-col gap-2" slot="content">
      <a href="/"><h2 class="pr-10">OpenPPP</h2></a>
      <hr/>
      <ul>
        <li><a href="/plugins.html">Saved Plugins</a></li>
      </ul>
    </nav>
  </msc-sidebar>
`;

class OpenpppSidebar extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = INNER_HTML;
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const btn = this.querySelector("button");

    /** @type {import("msc-sidebar/mjs/wc-msc-sidebar.js").MscSidebar} */
    // @ts-ignore
    const mscSidebar = this.querySelector("msc-sidebar");

    btn.onclick = () => {
      mscSidebar.open = true;
    };
  }
}

window.customElements.define("openppp-sidebar", OpenpppSidebar);

class NSPopUpButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }

  connectedCallback() {
  }

  render() {
    const { shadowRoot } = this;
    shadowRoot.innerHTML = /* html */ `
      <style>
        .appkit-pop-up-button select {
          appearance: none;

          /* Label */
          /* font-family: SFPro-Regular; */
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          font-size: 13px;
          color: rgba(0,0,0,0.85);
          line-height: 16px;

          /* Rectangle */
          background-color: transparent;
          border: 0.5px solid transparent;
          border-radius: 5px;
          padding-top: 2px;
          padding-left: 11px;
          padding-bottom: 2px;
          padding-right: calc(16px - 5px);
        }

        .appkit-pop-up-button select:hover {
          /* .appkit-button */
          /* base */
          background: #FFFFFF;
          border: 0.5px solid rgba(0,0,0,0.02);
          box-shadow: 0 0.25px 0.25px 0 rgba(0,0,0,0.15), 0 1px 0.75px 0 rgba(0,0,0,0.05);
          border-radius: 5px;
        }

        .appkit-pop-up-button {
          position: relative;
          display: flex;
          align-items: center;
        }

        .appkit-pop-up-button .indicator {
          margin-left: calc(-2px + -16px);
          pointer-events: none;

          /* Mask */
          width: 16px;
          height: 16px;
          background: rgba(0,0,0,0.02);
          border-radius: 4px;
        }

        .appkit-pop-up-button:hover .indicator {
          background-color: transparent;
        }
      </style>
      <div class="appkit-pop-up-button">
        <select></select>
        <div class="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708m0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708"/>
          </svg>
        </div>
      </div>
      <slot></slot>
    `;

    const select = shadowRoot.querySelector('select');
    const slot = this.querySelector('slot');
    const children = slot ? slot.assignedNodes().filter(node => node.nodeType === Node.ELEMENT_NODE) : [];
    children.forEach(child => {
      select.appendChild(child);
    });
  }
}

customElements.define('appkit-pop-up-button', NSPopUpButton);
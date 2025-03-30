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
      <link rel="stylesheet" href="../stylesheets/Form List.css">
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

    const select  = shadowRoot.querySelector('select');
    const options = this.querySelectorAll('option');
    options.forEach(option => {
      select.appendChild(option);
    });
  }
}

customElements.define('appkit-pop-up-button', NSPopUpButton);
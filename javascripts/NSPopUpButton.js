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
      <select class="appkit-pop-up-button"></select>
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
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
    shadowRoot.innerHTML = /* html */ `<select></select><slot></slot>`;

    const select  = shadowRoot.querySelector('select');
    const options = this.querySelectorAll('option');
    options.forEach(option => {
      select.appendChild(option);
    });
  }
}

customElements.define('appkit-pop-up-button', NSPopUpButton);
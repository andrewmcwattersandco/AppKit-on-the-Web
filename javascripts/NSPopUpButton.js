class NSPopUpButton extends HTMLElement {
  // https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-face-example
  // https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
  static formAssociated = true;
  // https://html.spec.whatwg.org/multipage/form-elements.html#htmlselectelement
  static observedAttributes = ['autocomplete', 'disabled', 'form', /* 'multiple', */ 'name', 'required', 'size', 'selectedIndex', 'value'];

  #internals;

  constructor() {
    super();
    this.attachShadow({mode: 'open', delegatesFocus: true});
    this.#internals = this.attachInternals();
    this.render();
  }

  get autocomplete() {
    return this.getAttribute('autocomplete');
  }

  set autocomplete(value) {
    this.shadowRoot.querySelector('select').setAttribute('autocomplete', value);
    this.setAttribute('autocomplete', value);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(flag) {
    this.shadowRoot.querySelector('select').toggleAttribute('disabled', Boolean(flag));
    this.toggleAttribute('disabled', Boolean(flag));
  }

  get form() {
    return this.#internals.form;
  }

  // get multiple() {
  //   return this.hasAttribute('multiple');
  // }

  // set multiple(flag) {
  //   this.shadowRoot.querySelector('select').toggleAttribute('multiple', Boolean(flag));
  //   this.toggleAttribute('multiple', Boolean(flag));
  // }

  get name() {
    return this.getAttribute('name');
  }

  set name(value) {
    this.shadowRoot.querySelector('select').setAttribute('name', value);
    this.setAttribute('name', value);
  }

  get required() {
    return this.hasAttribute('required');
  }

  set required(flag) {
    this.shadowRoot.querySelector('select').toggleAttribute('required', Boolean(flag));
    this.toggleAttribute('required', Boolean(flag));
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(value) {
    this.shadowRoot.querySelector('select').setAttribute('size', value);
    this.setAttribute('size', value);
  }

  get type() {
    return "select-one";
  }

  get selectedIndex() {
    return this.getAttribute('selectedIndex');
  }

  set selectedIndex(value) {
    this.shadowRoot.querySelector('select').selectedIndex = value;
    this.#internals.setFormValue(this.value);
  }

  get value() {
    return this.shadowRoot.querySelector('select').value;
  }

  set value(value) {
    this.shadowRoot.querySelector('select').value = value;
    this.#internals.setFormValue(value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const select = this.shadowRoot.querySelector('select');
    if (NSPopUpButton.observedAttributes.includes(name)) {
      if (newValue === null) {
        select.removeAttribute(name);
      } else {
        select.setAttribute(name, newValue);
      }
    }

    if (name === 'value') {
      this.#internals.setFormValue(this.value);
    }
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
    NSPopUpButton.observedAttributes.forEach(attr => {
      if (this.hasAttribute(attr)) {
        select.setAttribute(attr, this.getAttribute(attr));
      }
    });

    // const select = shadowRoot.querySelector('select');
    const slot = shadowRoot.querySelector('slot');
    const children = slot ? slot.assignedElements() : [];
    children.forEach(child => {
      select.appendChild(child);
    });

    select.addEventListener('change', (event) => {
      this.#internals.setFormValue(event.target.value);
    });
  }
}

customElements.define('appkit-pop-up-button', NSPopUpButton);
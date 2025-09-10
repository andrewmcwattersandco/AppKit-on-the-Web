class NSSwitch extends HTMLElement {
  // https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-face-example
  // https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
  static formAssociated = true;
  // https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)
  static observedAttributes = ['disabled', 'form', 'name', 'required', 'value'];

  #internals;

  constructor() {
    super();
    this.attachShadow({mode: 'open', delegatesFocus: true});
    this.#internals = this.attachInternals();
    this.render();
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(flag) {
    this.shadowRoot.querySelector('input[type="checkbox"]').toggleAttribute('disabled', Boolean(flag));
    this.toggleAttribute('disabled', Boolean(flag));
  }

  get form() {
    return this.#internals.form;
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(value) {
    this.shadowRoot.querySelector('input[type="checkbox"]').setAttribute('name', value);
    this.setAttribute('name', value);
  }

  get required() {
    return this.hasAttribute('required');
  }

  set required(flag) {
    this.shadowRoot.querySelector('input[type="checkbox"]').toggleAttribute('required', Boolean(flag));
    this.toggleAttribute('required', Boolean(flag));
    this.#updateValidity();
  }

  get value() {
    return this.shadowRoot.querySelector('input[type="checkbox"]').checked;
  }

  set value(value) {
    this.shadowRoot.querySelector('input[type="checkbox"]').checked = value;
    this.#internals.setFormValue(value);
    this.#updateValidity();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const input = this.shadowRoot.querySelector('input[type="checkbox"]');
    if (NSSwitch.observedAttributes.includes(name)) {
      if (newValue === null) {
        input.removeAttribute(name);
      } else {
        input.setAttribute(name, newValue);
      }
    }

    if (name === 'value') {
      const input = this.shadowRoot.querySelector('input[type="checkbox"]');
      this.#internals.setFormValue(input.checked, input.checked);
    }
  }

  connectedCallback() {
    this.#updateValidity();
  }

  #updateValidity() {
    if (this.required && !this.value) {
      this.#internals.setValidity({valueMissing: true}, 'Fill out this field', this.shadowRoot.querySelector('input[type="checkbox"]'));
    } else {
      this.#internals.setValidity({});
    }
  }

  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }

  render() {
    const { shadowRoot } = this;
    shadowRoot.innerHTML = /* html */ `
      <style>
        .appkit-switch input {
          appearance: none;

          width: 36px;
          height: 16px;
          border-radius: 100px;
          background: rgba(0,136,255,1);
          overflow: hidden;
        }

        .appkit-switch {
          position: relative;
          display: flex;
          align-items: center;
        }

        .appkit-switch .indicator {
          margin-left: calc(-18px - 7px);
          margin-right: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;

          /* Mask */
          width: 18px;
          height: 18px;
          border-radius: 100px;
          background: rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .appkit-switch:hover .indicator,
        .appkit-switch.active .indicator {
          background-color: transparent;
        }
      </style>
      <div class="appkit-switch">
        <input type="checkbox" />
        <div class="knob">
        </div>
      </div>
    `;

    const input = shadowRoot.querySelector('input[type="checkbox"]');
    NSSwitch.observedAttributes.forEach(attr => {
      if (this.hasAttribute(attr)) {
        input.setAttribute(attr, this.getAttribute(attr));
      }
    });

    input.addEventListener('change', (event) => {
      this.#internals.setFormValue(event.target.checked, event.target.checked);
      this.#updateValidity();
    });
  }
}

customElements.define('appkit-switch', NSSwitch);
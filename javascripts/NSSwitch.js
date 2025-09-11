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

          margin: 0;
          width: 36px;
          height: 16px;
          border-radius: 100px;
          background: rgba(0,0,0,0.03);
          box-shadow: inset 0 0 1px 0 rgba(0,0,0,0.06);
          overflow: hidden;
          transition: background 0.25s ease-out, box-shadow 0.25s ease-out;
        }

        .appkit-switch input:checked {
          background: rgba(0,136,255,1);
          box-shadow: initial;
        }

        .appkit-switch {
          position: relative;
          display: flex;
          align-items: center;
        }

        .appkit-switch .knob {
          margin-left: 1.5px;
          margin-right: 1.5px;
          position: absolute;
          width: 21px;
          height: 13px;
          border-radius: 50px;
          /* background: rgba(255,255,255,0.65); */
          background: rgba(255,255,255,1);
          box-shadow: inset 0 0 1px 0 rgba(255,255,255,0.10), inset -1.75px -2.5px 2px -1.5px #FFFFFF, inset 1.75px 2.5px 1px -1.5px #FFFFFF, 0 0 1px -0.25px rgba(0,0,0,0.05), 0 0 4px -0.5px rgba(0,0,0,0.05), 0 0 44px 0 rgba(0,0,0,0.10);
          pointer-events: none;
          transition: left 0.25s ease-out;
          left: 0;
        }

        .appkit-switch input:checked + .knob {
          left: calc(100% - 2 * 1.5px - 21px);
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
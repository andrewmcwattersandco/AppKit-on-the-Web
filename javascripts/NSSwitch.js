class NSSwitch extends HTMLElement {
  // https://html.spec.whatwg.org/dev/custom-elements.html#custom-elements-face-example
  // https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
  static formAssociated = true;
  // https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)
  static observedAttributes = ['disabled', 'form', 'name', 'required', 'value', 'checked', 'onchange'];

  #internals;

  constructor() {
    super();
    this.attachShadow({mode: 'open', delegatesFocus: true});
    this.#internals = this.attachInternals();
    this.#internals.role = 'switch';
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
    const input = this.shadowRoot.querySelector('input[type="checkbox"]');
    return input.checked ? (input.value || 'on') : null;
  }

  set value(value) {
    const input = this.shadowRoot.querySelector('input[type="checkbox"]');
    input.value = value;
    this.#internals.setFormValue(input.checked ? (input.value || 'on') : null);
    this.#updateValidity();
  }

  get checked() {
    return this.shadowRoot.querySelector('input[type="checkbox"]').checked;
  }

  set checked(flag) {
    this.shadowRoot.querySelector('input[type="checkbox"]').checked = Boolean(flag);
    this.toggleAttribute('checked', Boolean(flag));
    const input = this.shadowRoot.querySelector('input[type="checkbox"]');
    this.#internals.setFormValue(input.checked ? (input.value || 'on') : null);
    this.#updateValidity();
    this.#updateAriaChecked();
  }

  get onchange() {
    return this._onchange || null;
  }

  set onchange(value) {
    this._onchange = value;
    if (typeof value === 'string') {
      this.setAttribute('onchange', value);
    } else if (value === null || value === undefined) {
      this.removeAttribute('onchange');
      this._onchange = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const input = this.shadowRoot.querySelector('input[type="checkbox"]');
    if (NSSwitch.observedAttributes.includes(name) && name !== 'onchange') {
      if (newValue === null) {
        input.removeAttribute(name);
      } else {
        input.setAttribute(name, newValue);
      }
    }

    if (name === 'value') {
      const input = this.shadowRoot.querySelector('input[type="checkbox"]');
      this.#internals.setFormValue(input.checked ? (input.value || 'on') : null);
    }
  }

  connectedCallback() {
    this.#updateValidity();
    this.#updateAriaChecked();
  }

  #updateValidity() {
    if (this.required && !this.checked) {
      this.#internals.setValidity({valueMissing: true}, 'Fill out this field', this.shadowRoot.querySelector('input[type="checkbox"]'));
    } else {
      this.#internals.setValidity({});
    }
  }

  #updateAriaChecked() {
    this.#internals.ariaChecked = String(this.checked);
  }

  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }

  render() {
    const { shadowRoot } = this;
    shadowRoot.innerHTML = /* html */ `<template>
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
      display: inline-flex;
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

    :host([disabled]) .appkit-switch input {
      background: rgba(0,0,0,0.03);
      box-shadow: inset 0 0 1px 0 rgba(0,0,0,0.02);
    }

    :host([disabled]) .appkit-switch input:checked {
      background: rgba(0,136,255,0.23);
    }

    :host([disabled]) .appkit-switch .knob {
      opacity: 0.5;
      border-radius: 50px;
      /* background: rgba(255,255,255,0.65); */
      background: rgba(255,255,255,1);
      box-shadow: inset 0 0 1px 0 rgba(255,255,255,0.10), inset -1.75px -2.5px 2px -1.5px #FFFFFF, inset 1.75px 2.5px 1px -1.5px #FFFFFF, 0 0 1px -0.25px rgba(0,0,0,0.05), 0 0 4px -0.5px rgba(0,0,0,0.05), 0 0 44px 0 rgba(0,0,0,0.10);
    }
  </style>
</template>
<div class="appkit-switch">
  <input type="checkbox" />
  <div class="knob">
  </div>
</div>`;

    const template = shadowRoot.querySelector('template');
    if (!NSSwitch.sheet) {
      const style = template.content.querySelector('style');
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(style.textContent);
      NSSwitch.sheet = sheet;
    }
    shadowRoot.adoptedStyleSheets.push(NSSwitch.sheet);
    template.remove();

    const input = shadowRoot.querySelector('input[type="checkbox"]');
    NSSwitch.observedAttributes.forEach(attr => {
      if (this.hasAttribute(attr) && attr !== 'onchange') {
        input.setAttribute(attr, this.getAttribute(attr));
      }
    });

    input.addEventListener('change', (event) => {
      this.#internals.setFormValue(event.target.checked ? (event.target.value || 'on') : null);
      this.#updateValidity();
      this.#updateAriaChecked();

      if (typeof this._onchange === 'function') {
        try {
          this._onchange.call(this, event);
        } catch (e) {
          console.error(e);
        }
      } else {
        const onchangeAttr = this.getAttribute('onchange');
        if (onchangeAttr) {
          try {
            const onchangeFunc = new Function('event', onchangeAttr);
            onchangeFunc.call(this, event);
          } catch (e) {
            console.error(e);
          }
        }
      }

      this.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}

customElements.define('appkit-switch', NSSwitch);
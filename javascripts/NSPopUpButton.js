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
    this.#updateValidity();
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
    this.#updateWidth();
    this.#updateValidity();
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

    if (name === 'selectedIndex' || name === 'value') {
      const select = this.shadowRoot.querySelector('select');
      this.#internals.setFormValue(select.value, select.value);
    }
  }

  connectedCallback() {
    this.#updateValidity();
  }

  #updateWidth() {
    // Update the width of the select element to shrink to fit the content.
    // Create a span to measure the width of the text.
    const select = this.shadowRoot.querySelector('select');
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'nowrap';
    span.style.font = getComputedStyle(select).font;
    const option = select.options[select.selectedIndex];
    span.textContent = option ? option.text : '';
    document.body.appendChild(span);
    const width = 12 + span.offsetWidth + 12 + 18 + 7; // 12px padding-left + span + 12px padding-right + 18px indicator + 7px margin-right
    document.body.removeChild(span);
    select.style.width = `${width}px`;
  }

  #updateValidity() {
    if (this.required && !this.value) {
      this.#internals.setValidity({valueMissing: true}, 'Fill out this field', this.shadowRoot.querySelector('select'));
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
        .appkit-pop-up-button select,
        .appkit-pop-up-button-select {
          appearance: none;

          /* Label */
          /* font-family: SFPro-Regular; */
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          font-size: 13px;
          letter-spacing: -0.2px;
          color: rgba(0,0,0,0.85);
          line-height: 16px;

          /* Rectangle */
          background-color: transparent;
          border-width: 0;
          border-radius: 6px;
          padding-top: 4px;
          padding-left: 12px;
          padding-bottom: 4px;
          padding-right: calc(18px + 7px);
          overflow: hidden;

          cursor: default;
        }

        .appkit-pop-up-button-select {
          /* Rectangle */
          padding-right: 7px;
        }

        .appkit-pop-up-button select:hover,
        .appkit-pop-up-button-select:hover,
        .appkit-pop-up-button.active select,
        .appkit-pop-up-button-select.active {
          /* .appkit-button */
          /* base */
          background: rgba(0,0,0,0.05);
        }

        .appkit-pop-up-button,
        .appkit-pop-up-button-select {
          position: relative;
          display: flex;
          align-items: center;
        }

        .appkit-pop-up-button .indicator {
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

        .appkit-pop-up-button-select::after {
          margin-left: 12px;
          content: "";
          display: inline-block;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNy4yMzgzMTE3N3B4IiBoZWlnaHQ9IjEwLjM4OTMyOHB4IiB2aWV3Qm94PSIwIDAgNy4yMzgzMTE3NyAxMC4zODkzMjgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGcgaWQ9IvSAi4AtU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbC1vcGFjaXR5PSIwLjg1Ij4KICAgIDxnIGlkPSL0gIaPIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOC40MTg5LCAtNy4yMjIzKSIgZmlsbD0iIzAwMDAwMCI+CiAgICAgIDxwYXRoIGQ9Ik0xMi4wNDAyNzAzLDcuMjIyMzI4MTkgQzEyLjE0ODE4MDQsNy4yMjIzMjgxOSAxMi4yNTAzMzgsNy4yNDQxMTUxOSAxMi4zNDY3NDMsNy4yODc2ODkyMSBDMTIuNDQzMTQ4MSw3LjMzMTI2MzIyIDEyLjUzNTYxODksNy4zOTY2MjQyNSAxMi42MjQxNTU1LDcuNDgzNzcyMjggTDE1LjQwODY5MzcsMTAuMTUxODcwNyBDMTUuNDgwNTAxNiwxMC4yMjUxOTk0IDE1LjUzOTg3ODYsMTAuMzA1ODg0IDE1LjU4NjgyNDgsMTAuMzkzOTI0NyBDMTUuNjMzNzcxLDEwLjQ4MTk2NTQgMTUuNjU3MjQ0MSwxMC41ODAzNzA2IDE1LjY1NzI0NDEsMTAuNjg5MTQwMyBDMTUuNjU3MjQ0MSwxMC45MDI5MTA5IDE1LjU4MzczMzcsMTEuMDc5MzM5MyAxNS40MzY3MTI3LDExLjIxODQyNTggQzE1LjI4OTY5MTcsMTEuMzU3NTEyMiAxNS4xMjAwMDc2LDExLjQyNzA1NTQgMTQuOTI3NjYwNCwxMS40MjcwNTU0IEMxNC44MzQ2OTM3LDExLjQyNzA1NTQgMTQuNzQyNDA0NywxMS40MTAzOTI4IDE0LjY1MDc5MzUsMTEuMzc3MDY3NiBDMTQuNTU5MTgyMywxMS4zNDM3NDI0IDE0LjQ3MjI4MjIsMTEuMjg5NTIyOCAxNC4zOTAwOTMzLDExLjIxNDQwODkgTDEyLjA0MDI3MDMsOC45MTExMDIyOSBMOS42ODYwODMyNiwxMS4yMTQ0MDg5IEM5LjYwNjczNzU1LDExLjI5MjQzMjEgOS41MjA1MzE3NSwxMS4zNDczNzkgOS40Mjc0NjU4NiwxMS4zNzkyNDk2IEM5LjMzNDM5OTk2LDExLjQxMTEyMDEgOS4yNDI4MzgzMiwxMS40MjcwNTU0IDkuMTUyNzgwOTUsMTEuNDI3MDU1NCBDOC45NTg5MTI5NSwxMS40MjcwNTU0IDguNzg4MTM3ODUsMTEuMzU3NTEyMiA4LjY0MDQ1NTY2LDExLjIxODQyNTggQzguNDkyNzczNDcsMTEuMDc5MzM5MyA4LjQxODkzMjM4LDEwLjkwMjkxMDkgOC40MTg5MzIzOCwxMC42ODkxNDAzIEM4LjQxODkzMjM4LDEwLjU4MDM3MDYgOC40NDI0MDU0OCwxMC40ODE5NjU0IDguNDg5MzUxNjksMTAuMzkzOTI0NyBDOC41MzYyOTc5LDEwLjMwNTg4NCA4LjU5NTY3NDkzLDEwLjIyNTE5OTQgOC42Njc0ODI3OSwxMC4xNTE4NzA3IEwxMS40NTYzODUxLDcuNDgzNzcyMjggQzExLjU0NDkyMTcsNy4zOTY2MjQyNSAxMS42MzY2NjUxLDcuMzMxMjYzMjIgMTEuNzMxNjE1NSw3LjI4NzY4OTIxIEMxMS44MjY1NjU4LDcuMjQ0MTE1MTkgMTEuOTI5NDUwOCw3LjIyMjMyODE5IDEyLjA0MDI3MDMsNy4yMjIzMjgxOSBaIE0xMi4wNDAyNzAzLDE3LjYxMTY1NjIgQzExLjkyOTQ1MDgsMTcuNjExNjU2MiAxMS44MjY1NjU4LDE3LjU4OTg2OTIgMTEuNzMxNjE1NSwxNy41NDYyOTUyIEMxMS42MzY2NjUxLDE3LjUwMjcyMTIgMTEuNTQ0OTIxNywxNy40MzczNjAxIDExLjQ1NjM4NTEsMTcuMzUwMjEyMSBMOC42Njc0ODI3OSwxNC42ODIxMTM2IEM4LjU5NTY3NDkzLDE0LjYwODc4NSA4LjUzNjI5NzksMTQuNTI3NzUzMiA4LjQ4OTM1MTY5LDE0LjQzOTAxODIgQzguNDQyNDA1NDgsMTQuMzUwMjgzMyA4LjQxODkzMjM4LDE0LjI1MjIyNTIgOC40MTg5MzIzOCwxNC4xNDQ4NDQxIEM4LjQxODkzMjM4LDEzLjkzMTA3MzUgOC40OTI3NzM0NywxMy43NTQ2NDUgOC42NDA0NTU2NiwxMy42MTU1NTg2IEM4Ljc4ODEzNzg1LDEzLjQ3NjQ3MjIgOC45NTg5MTI5NSwxMy40MDY5MjkgOS4xNTI3ODA5NSwxMy40MDY5MjkgQzkuMjQyODM4MzIsMTMuNDA2OTI5IDkuMzM0Mzk5OTYsMTMuNDIyNTMzNyA5LjQyNzQ2NTg2LDEzLjQ1Mzc0MyBDOS41MjA1MzE3NSwxMy40ODQ5NTIzIDkuNjA2NzM3NTUsMTMuNTQwMjI5OCA5LjY4NjA4MzI2LDEzLjYxOTU3NTUgTDEyLjA0MDI3MDMsMTUuOTIyODgyMSBMMTQuMzkwMDkzMywxMy42MTk1NzU1IEMxNC40NzIyODIyLDEzLjU0MzEzOTEgMTQuNTU5MTgyMywxMy40ODg1ODkgMTQuNjUwNzkzNSwxMy40NTU5MjUgQzE0Ljc0MjQwNDcsMTMuNDIzMjYxIDE0LjgzNDY5MzcsMTMuNDA2OTI5IDE0LjkyNzY2MDQsMTMuNDA2OTI5IEMxNS4xMjAwMDc2LDEzLjQwNjkyOSAxNS4yODk2OTE3LDEzLjQ3NjQ3MjIgMTUuNDM2NzEyNywxMy42MTU1NTg2IEMxNS41ODM3MzM3LDEzLjc1NDY0NSAxNS42NTcyNDQxLDEzLjkzMTA3MzUgMTUuNjU3MjQ0MSwxNC4xNDQ4NDQxIEMxNS42NTcyNDQxLDE0LjI1MjIyNTIgMTUuNjMzNzcxLDE0LjM1MDI4MzMgMTUuNTg2ODI0OCwxNC40MzkwMTgyIEMxNS41Mzk4Nzg2LDE0LjUyNzc1MzIgMTUuNDgwNTAxNiwxNC42MDg3ODUgMTUuNDA4NjkzNywxNC42ODIxMTM2IEwxMi42MjQxNTU1LDE3LjM1MDIxMjEgQzEyLjUzNTYxODksMTcuNDM3MzYwMSAxMi40NDMxNDgxLDE3LjUwMjcyMTIgMTIuMzQ2NzQzLDE3LjU0NjI5NTIgQzEyLjI1MDMzOCwxNy41ODk4NjkyIDEyLjE0ODE4MDQsMTcuNjExNjU2MiAxMi4wNDAyNzAzLDE3LjYxMTY1NjIgWiIgaWQ9IlNoYXBlIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsOyI+PC9wYXRoPgogICAgPC9nPgogIDwvZz4KPC9zdmc+'), rgba(0,0,0,0.05);
          background-size: 7.23831177px 10.389328px;
          background-repeat: no-repeat;
          background-position: center;
          vertical-align: middle;

          /* Mask */
          width: 18px;
          height: 18px;
          border-radius: 100px;
          /* background: rgba(0,0,0,0.05); */
          overflow: hidden;
        }

        .appkit-pop-up-button:hover .indicator,
        .appkit-pop-up-button.active .indicator {
          background-color: transparent;
        }

        :host([disabled]) {
          pointer-events: none;
        }
      </style>
      <div class="appkit-pop-up-button">
        <select></select>
        <div class="indicator">
          <svg width="7.23831177px" height="10.389328px" viewBox="0 0 7.23831177 10.389328" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="􀋀-Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" fill-opacity="0.85">
                  <g id="􀆏" transform="translate(-8.4189, -7.2223)" fill="#000000">
                      <path d="M12.0402703,7.22232819 C12.1481804,7.22232819 12.250338,7.24411519 12.346743,7.28768921 C12.4431481,7.33126322 12.5356189,7.39662425 12.6241555,7.48377228 L15.4086937,10.1518707 C15.4805016,10.2251994 15.5398786,10.305884 15.5868248,10.3939247 C15.633771,10.4819654 15.6572441,10.5803706 15.6572441,10.6891403 C15.6572441,10.9029109 15.5837337,11.0793393 15.4367127,11.2184258 C15.2896917,11.3575122 15.1200076,11.4270554 14.9276604,11.4270554 C14.8346937,11.4270554 14.7424047,11.4103928 14.6507935,11.3770676 C14.5591823,11.3437424 14.4722822,11.2895228 14.3900933,11.2144089 L12.0402703,8.91110229 L9.68608326,11.2144089 C9.60673755,11.2924321 9.52053175,11.347379 9.42746586,11.3792496 C9.33439996,11.4111201 9.24283832,11.4270554 9.15278095,11.4270554 C8.95891295,11.4270554 8.78813785,11.3575122 8.64045566,11.2184258 C8.49277347,11.0793393 8.41893238,10.9029109 8.41893238,10.6891403 C8.41893238,10.5803706 8.44240548,10.4819654 8.48935169,10.3939247 C8.5362979,10.305884 8.59567493,10.2251994 8.66748279,10.1518707 L11.4563851,7.48377228 C11.5449217,7.39662425 11.6366651,7.33126322 11.7316155,7.28768921 C11.8265658,7.24411519 11.9294508,7.22232819 12.0402703,7.22232819 Z M12.0402703,17.6116562 C11.9294508,17.6116562 11.8265658,17.5898692 11.7316155,17.5462952 C11.6366651,17.5027212 11.5449217,17.4373601 11.4563851,17.3502121 L8.66748279,14.6821136 C8.59567493,14.608785 8.5362979,14.5277532 8.48935169,14.4390182 C8.44240548,14.3502833 8.41893238,14.2522252 8.41893238,14.1448441 C8.41893238,13.9310735 8.49277347,13.754645 8.64045566,13.6155586 C8.78813785,13.4764722 8.95891295,13.406929 9.15278095,13.406929 C9.24283832,13.406929 9.33439996,13.4225337 9.42746586,13.453743 C9.52053175,13.4849523 9.60673755,13.5402298 9.68608326,13.6195755 L12.0402703,15.9228821 L14.3900933,13.6195755 C14.4722822,13.5431391 14.5591823,13.488589 14.6507935,13.455925 C14.7424047,13.423261 14.8346937,13.406929 14.9276604,13.406929 C15.1200076,13.406929 15.2896917,13.4764722 15.4367127,13.6155586 C15.5837337,13.754645 15.6572441,13.9310735 15.6572441,14.1448441 C15.6572441,14.2522252 15.633771,14.3502833 15.5868248,14.4390182 C15.5398786,14.5277532 15.4805016,14.608785 15.4086937,14.6821136 L12.6241555,17.3502121 C12.5356189,17.4373601 12.4431481,17.5027212 12.346743,17.5462952 C12.250338,17.5898692 12.1481804,17.6116562 12.0402703,17.6116562 Z" id="Shape" fill-rule="nonzero" style="mix-blend-mode: normal;"></path>
                  </g>
              </g>
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
      this.#internals.setFormValue(event.target.value, event.target.value);
      this.#updateWidth();
      this.#updateValidity();
    });

    this.#updateWidth();
  }
}

customElements.define('appkit-pop-up-button', NSPopUpButton);
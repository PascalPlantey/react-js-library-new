/**
 * Manipulate (read/write) a CSS variable (defined in :root)
 */
class CSSVariable {
  #name;

  /**
   * @param {string} name
   * @description The name can have the preceding '--' or not
   */
  constructor(name) {
    this.#name = name.startsWith('--') ? name : `--${name}`;
  }

  /**
   * Read/Write the value of CSS variable
   * @example
   * App.css
   * :root {
   *   --app-header-height: 48px;
   * }
   * App.js
   * const variable = new CSSVariable('app-header-height');
   * variable.value = '48em';
   */
  get value() {
    return getComputedStyle(document.documentElement).getPropertyValue(this.#name);
  }

  set value(value) {
    document.documentElement.style.setProperty(this.#name, value);
  }

  /**
   * Changed the default object type name visible through Object.prototype.toString.call
   * @returns {string} CSSVariable
   */
  get [Symbol.toStringTag]() {
    return 'CSSVariable';
  }
};

export default CSSVariable;
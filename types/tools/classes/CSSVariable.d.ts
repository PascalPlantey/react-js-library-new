export default CSSVariable;
/**
 * Manipulate (read/write) a CSS variable (defined in :root)
 */
declare class CSSVariable {
    /**
     * @param {string} name
     * @description The name can have the preceding '--' or not
     */
    constructor(name: string);
    set value(value: string);
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
    get value(): string;
    /**
     * Changed the default object type name visible through Object.prototype.toString.call
     * @returns {string} CSSVariable
     */
    get [Symbol.toStringTag](): string;
    #private;
}

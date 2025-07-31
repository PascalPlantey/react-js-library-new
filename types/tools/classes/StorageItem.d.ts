export default StorageItem;
/**
 * @classdesc Manages the read/write/delete of an individual item of the storage (local/session).  If the key is not provided
 * the StorageItem object still works but do not save the value to the storage
 */
declare class StorageItem {
    /**
      * @param {string} [key] Storage key
      * @param {Array<any>} [dflt=[]] Default value if key does not exist in the storage ([] if not provided)
      * @param {boolean} [local=true] Local storage if true, session storage otherwise
      */
    constructor(key?: string, dflt?: Array<any>, local?: boolean);
    /**
     * Key name
     */
    get key(): string;
    set value(val: any);
    /**
     * Read/write the stored value
     * @example
     * if (storageItem.value < 0)
     *   storageItem.value = 1;
     */
    get value(): any;
    /**
     * Deletes the value from the storage. storageItem.value becomes `undefined`
     * @returns {void}
     */
    remove(): void;
    /**
     * Changed the default object type name visible through Object.prototype.toString.call
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
    #private;
}

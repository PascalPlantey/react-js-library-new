export default ExtArray;
declare class ExtArray extends Array<any> {
    /**
     * Returns true if the items in toBeMoved can be moved by n positions to the right or the left in the 'elements' array
     * @param {Array} elements Array of items
     * @param {Array|any} toBeMoved One or many items from 'elements' that should be moved
     * @param {Number} [by=1] Number of positions we want to move toBeMoved items to the right (by > 0) or the left (by < 0)
     * @returns {Boolean} true if the items in toBeMoved can be moved
     */
    static canMove(elements: any[], toBeMoved: any[] | any, by?: number): boolean;
    /**
     * Move the items in toBeMoved by 'by' positions to the left (by < 0) or to the right (by > 0)
     * @param {Array} elements Array of items
     * @param {Array|any} toBeMoved One or many items from 'elements' that should be moved
     * @param {Number} [by=1] Number of positions we want to move toBeMoved items to the right (by > 0) or the left (by < 0)
     * @returns {Array} elements if by is 0, a new array with the elements reordered otherwise
     */
    static move(elements: any[], toBeMoved: any[] | any, by?: number): any[];
    constructor(args: any);
    get first(): any;
    get last(): any;
    get [Symbol.toStringTag](): string;
}

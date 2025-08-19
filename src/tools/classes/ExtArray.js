import isIterable from '../is/isIterable';
import isString from '../is/isString';

import toIterable from '../misc/toIterable';

class ExtArray extends Array {
  constructor(args) {
    super();

    if      (isString(args))
      super.push(args);
    else if (isIterable(args))
      for(const arg of args)                                // Parent is an Array but does not have 'from' prototype...
        super.push(arg);
    else if (args)
      super.push(args);
  }

  get first() { return super.at(0); }
  get last() { return super.at(super.length - 1); }

  /**
   * Returns true if the items in toBeMoved can be moved by n positions to the right or the left in the 'elements' array
   * @param {Array} elements Array of items
   * @param {Array|any} toBeMoved One or many items from 'elements' that should be moved
   * @param {Number} [by=1] Number of positions we want to move toBeMoved items to the right (by > 0) or the left (by < 0)
   * @returns {Boolean} true if the items in toBeMoved can be moved
   */
  static canMove(elements, toBeMoved, by = 1) {
    // toBeMoved items must be sorted in the same order than elements
    const moveItems = [...toIterable(toBeMoved)]
                      .sort((it1, it2) => elements.indexOf(it1) - elements.indexOf(it2));
    const nPos = Math.abs(by);

    if (by < 0)
      return moveItems.length && elements.length > nPos && elements.indexOf(moveItems[0]) > (nPos - 1);
    else if (by > 0)
      return moveItems.length && elements.length > nPos &&
             elements.indexOf(moveItems[moveItems.length - nPos]) < elements.length - nPos;
    else
      return false;
  }

  /**
   * Move the items in toBeMoved by 'by' positions to the left (by < 0) or to the right (by > 0)
   * @param {Array} elements Array of items
   * @param {Array|any} toBeMoved One or many items from 'elements' that should be moved
   * @param {Number} [by=1] Number of positions we want to move toBeMoved items to the right (by > 0) or the left (by < 0)
   * @returns {Array} elements if by is 0, a new array with the elements reordered otherwise
   */
  static move(elements, toBeMoved, by = 1) {
    if (!by) return elements;                                         // Nothing to be changed

    // toBeMoved items must be sorted in the same order than elements
    const moveItems = [...toIterable(toBeMoved)]
                      .sort((it1, it2) => elements.indexOf(it1) - elements.indexOf(it2));
    const nPos = Math.abs(by);
    let newArray = [...elements];

    if (by < 0)
      for(const key of moveItems) {
        const tmpArray = [...newArray];
        const index = tmpArray.indexOf(key);
        tmpArray.splice(index, 1);                                    // Remove the item
        tmpArray.splice(index - nPos, 0, key);                        // Insert at new position
        newArray = tmpArray;
      }
    else
      for(let i = moveItems.length - 1; i >= 0; --i) {
        const key = moveItems[i];
        const tmpArray = [...newArray];
        const index = tmpArray.indexOf(key);
        tmpArray.splice(index, 1);
        tmpArray.splice(index + nPos, 0, key);
        newArray = tmpArray;
      }

    return newArray;
  }

  get [Symbol.toStringTag]() {
    return 'ExtArray';
  }
}

export default ExtArray;
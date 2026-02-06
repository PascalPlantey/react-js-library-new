import isFunction from "../is/isFunction";

export class BTreeNode {
  values = [];
  children = [];
  parent = null;

  constructor(parent = null) {
    this.parent = parent;
  }

  get size() {
    return this.values.length;
  }

  isRoot() {
    return this.parent === null;
  }

  isLeaf() {
    return this.children.length === 0;
  }

  isEmpty() {
    return this.values.length === 0;
  }

  needsSplit(order) {
    return this.size === (2 * order - 1);
  }

  getValue(index) {
    return this.values[index];
  }
  setValue(index, value) {
    this.values[index] = value;
    return this;
  }

  getValues(start, end) {
    return this.values.slice(start, end);
  }
  setValues(values) {
    this.values = values;
    return this;
  }

  insertValue(index, value) {
    this.values.splice(index, 0, value);
    return this;
  }

  removeValues(start, end) {
    this.values.splice(start, end - start);
    return this;
  }

  getChild(index) {
    console.assert(index >= 0 && index < this.children.length, "BTreeNode: getChild index out of bounds");
    return this.children[index];
  }
  setChild(index, child) {
    console.assert(index >= this.children.length, "BTreeNode: setChild index out of bounds");
    this.children[index] = child;
    if (child) child.parent = this;
    return this;
  }

  getChildren(start, end) {
    return this.children.slice(start, end);
  }
  setChildren(children) {
    this.children = children;
    this.updateChildrenParent();
    return this;
  }

  insertChild(index, child) {
    this.children.splice(index, 0, child);
    if (child) child.parent = this;
    return this;
  }

  removeChildren(start, end) {
    this.children.splice(start, end - start);
    return this;
  }

  getParent() {
    return this.parent;
  }
  setParent(parent) {
    this.parent = parent;
    return this;
  }

  // Get the immediate successor (node, index) from a (node, index)
  next(index) {
    let node = this;

    // If there's a right child, go down to find the smallest in that subtree
    if (!node.isLeaf()) {
      node = node.getChild(index + 1);
      while (!node.isLeaf()) node = node.getChild(0);
      return [node.getValue(0), node, 0];
    }

    // If not, go up to find a parent where we came from a left child
    let parent = node.parent;
    let child = node;

    while (parent) {
      const idx = parent.children.indexOf(child);

      if (idx < parent.size)
        return [parent.getValue(idx), parent, idx]; // Found the successor

      child = parent;
      parent = parent.parent;
    }

    // No successor (we were at the last element)
    return null;
  }

  // Same as next(), but for predecessor
  prev(index) {
    let node = this;

    if (!node.isLeaf()) {
      node = node.getChild(index);
      while (!node.isLeaf()) node = node.getChild(node.size);
      return [node.getValue(node.size - 1), node, node.size - 1];
    }

    let parent = node.parent;
    let child = node;

    while (parent) {
      const idx = parent.children.indexOf(child);

      if (idx > 0)
        return [parent.getValue(idx - 1), parent, idx - 1];

      child = parent;
      parent = parent.parent;
    }

    return null;
  }

  find(cmpFn, value, thisArg = this) {
    console.assert(isFunction(cmpFn), "BTreeNode: find requires a comparison function");
    let i;

    // Find the first key greater than or equal to the target key
    for (i = 0; i < this.size && cmpFn.call(thisArg, this.getValue(i), value, i, this) < 0; i++)
      ;

    if (i < this.size && cmpFn.call(thisArg, this.getValue(i), value, i, this) === 0)
      return [this.getValue(i), this, i];               // Found the value

    else if (this.isLeaf())
      return [null, null, -1];                          // Not found and no children to search

    else
      return this.getChild(i).find(cmpFn, thisArg);     // Search in the appropriate child
  }

  updateChildrenParent() {
    for (const child of this.children) {
      if (child) child.parent = this;
    }
    return this;
  }

  get [Symbol.toStringTag]() {
    return 'BTreeNode';
  }
}

export class BTree {
  cmpFn;
  order;
  root = null;

  constructor(cmpFn, order = 2) {
    console.assert(isFunction(cmpFn), "BTree: constructor requires a comparison function");
    console.assert(order >= 2, "BTree: order (minimum degree) must be at least 2");
    this.cmpFn = cmpFn;
    this.order = order;
    this.root = new BTreeNode();
  }

  get height() {
    let height = 0;
    let node = this.root;
    while (node && !node.isLeaf()) {
      height++;
      node = node.getChild(0);
    }
    return height;
  }

  get size() {
    function countNodes(node) {
      if (!node) return 0;
      let count = node.size; // Count this node

      for (const child of node.children)
        count += countNodes(child);

      return count;
    }
    return countNodes(this.root);
  }

  get first() {
    let node = this.root;
    if (!node || node.isEmpty()) return null;
    while (!node.isLeaf()) node = node.getChild(0);
    return [node.getValue(0), node, 0];
  }

  get last() {
    let node = this.root;
    if (!node || node.isEmpty()) return null;
    while (!node.isLeaf()) node = node.getChild(node.size - 1);
    return [node.getValue(node.size - 1), node, node.size - 1];
  }

  // Search in the B-tree starting from the root using the comparison function
  find(value) {
    return this.root.find(this.cmpFn, value);
  }

  /**
   * Insert a new value into the B-tree
   * @param {any} value 
   * @returns {BTree} The B-tree instance
   * 
   * @description
   * - If the key is already present, its value is updated
   * - If the root (where it should be added) is full, it is splitted and the median key is promoted to the parent
   *   node; the old root becomes the left child of the new root, and a new right child is created in splitChild()
   * - The new key is then inserted in the appropriate child node (which is guaranteed not to be full)
   * - If the root is not full, the new key is inserted directly in the root or in one of its children
   */
  insert(value) {
    const { order, root } = this;

    // If key is already present, update its value
    const [_, node, index] = this.find(value);
    if (node) {
      node.setValue(index, value);
      return this;
    }

    // key is not present, insert it
    if (root.needsSplit(order)) {                       // Root is full, need to split
      const newNode = new BTreeNode();                  // Create a new root

      newNode.setChild(0, root);                        // Old root becomes a child of the new root
      root.setParent(newNode);                          // New node becomes parent of old root

      this
      .#splitChild(newNode, 0)                          // Split the old root and move a key to the new root
      .#insertNonFull(newNode, value)                   // Insert the new key in the new root
      .root = newNode;                                  // Change root
    } else
      this.#insertNonFull(root, value);                 // Root is not full, insert the new key in the root

    return this;
  }

  /**
   * Insert a new value in a node: this node assumed not full and the value not present
   * @param {BTreeNode} node Node into which value must be inserted (if not full)
   * @param {any} value Value to insert
   * @returns {BTree} The B-tree instance
   */
  #insertNonFull(node, value) {
    let i;

    // Find the place that is going to have the new value
    for (i = node.size - 1; i >= 0 && this.cmpFn(value, node.getValue(i)) < 0; --i)
      ;

    if (node.isLeaf())
      node.insertValue(i + 1, value);                   // Insert the new value at the found location
    else {
      i++;                                              // Move to the child that is going to have the new value

      if (node.getChild(i).needsSplit(this.order)) {    // The child must be splitted first
        this.#splitChild(node, i);                      // Split it
        if (this.cmpFn(value, node.getValue(i)) > 0)    // Check if the new value has to be inserted in the right child
          i++;
      }

      this.#insertNonFull(node.getChild(i), value);     // Insert the new value in the appropriate child
    }

    return this;
  }

  /**
   * Split a full child of a B-tree node
   * @param {BTreeNode} parent Node whose child `i` must be splitted
   * @param {number} i Index of the child to split
   * @returns {BTree} The B-tree instance
   */
  #splitChild(parent, i) {
    const order = this.order;
    const child = parent.getChild(i);
    const median = child.getValue(order - 1);           // Median key to be promoted
    const newNode = new BTreeNode(parent);              // New node which is going to store (order-1) keys of the parent

    newNode.setValues(child.getValues(order));          // Get last (order-1) keys of child
    child.removeValues(order - 1, child.size);          // Remove those keys from child

    if (!child.isLeaf()) {
      newNode.setChildren(child.getChildren(order));    // Assign last order children nodes to newNode
      child.removeChildren(order, child.children.length); // Remove those children from child
    }

    parent
    .insertValue(i, median)                             // Insert the median key into parent
    .insertChild(i + 1, newNode);                       // Insert the new child into parent's children

    return this;
  }

  remove(value) {
    this.#removeInternal(this.root, value);

    // If the root has no values and has children, replace it with its only child
    if (this.root.size === 0 && !this.root.isLeaf()) {
      this.root = this.root.getChild(0);
      this.root.setParent(null);
    }

    return this;
  }

  #removeInternal(node, value) {
    const order = this.order;
    const cmp = this.cmpFn;

    // Find the index of the value to delete or the child to descend
    let idx;
    for (idx = 0; idx < node.size && cmp(value, node.getValue(idx)) > 0; idx++)
      ;

    // Case 1 : the value is present in this node
    if (idx < node.size && cmp(value, node.getValue(idx)) === 0) {
      if (node.isLeaf())
        // Case 1a : leaf node, direct removal
        node.removeValues(idx, idx + 1);
      else {
        // Case 1b : internal node, need to replace with predecessor or successor
        // and then remove the predecessor/successor recursively
        const predChild = node.getChild(idx);
        const succChild = node.getChild(idx + 1);

        // If the predecessor has at least order values, replace with the predecessor
        if (predChild.size >= order) {
          let pred = predChild;
          while (!pred.isLeaf()) pred = pred.getChild(pred.size);
          const predValue = pred.getValue(pred.size - 1);
          node.setValue(idx, predValue);
          this.#removeInternal(predChild, predValue);
        }
        // If not, if the successor has at least order values, replace with the successor
        else if (succChild.size >= order) {
          let succ = succChild;
          while (!succ.isLeaf()) succ = succ.getChild(0);
          const succValue = succ.getValue(0);
          node.setValue(idx, succValue);
          this.#removeInternal(succChild, succValue);
        }
        // If not, merge the two children and remove recursively
        else
          this
          .#merge(node, idx)
          .#removeInternal(predChild, value);
      }
    }

    // Case 2 : the value is not present in this node
    else if (!node.isLeaf()) {
      let child = node.getChild(idx);

      // If the child has less than order values, it needs to be filled before descending
      if (child.size < order) {
        // Borrow from left sibling
        if (idx > 0 && node.getChild(idx - 1).size >= order)
          this.#borrowFromPrev(node, idx);
        // Borrow from right sibling
        else if (idx < node.size && node.getChild(idx + 1).size >= order)
          this.#borrowFromNext(node, idx);
        // Merge with a neighbor
        else {
          if (idx < node.size)
            this.#merge(node, idx);
          else {
            this.#merge(node, idx - 1);
            child = node.getChild(idx - 1);
          }
        }
      }
      this.#removeInternal(child, value);
    }
    // Case 3 : the value is not present and the node is a leaf → nothing to do

    return this;
  }

  // Merges child[idx] and child[idx+1] into child[idx]
  #merge(parent, idx) {
    const child = parent.getChild(idx);
    const sibling = parent.getChild(idx + 1);

    // Add the parent's value between the two children
    child.insertValue(child.size, parent.getValue(idx));

    // Add all values from the sibling
    for (let i = 0; i < sibling.size; i++)
      child.insertValue(child.size, sibling.getValue(i));

    // Add all children from the sibling
    for (let i = 0; i < sibling.children.length; i++)
      child.insertChild(child.children.length, sibling.getChild(i));

    // Remove the parent's value and the sibling
    parent
    .removeValues(idx, idx + 1)
    .removeChildren(idx + 1, idx + 2);

    return this;
  }

  // Borrows a value from the left sibling
  #borrowFromPrev(parent, idx) {
    const child = parent.getChild(idx);
    const sibling = parent.getChild(idx - 1);

    // Shift child values/children to the right
    child.insertValue(0, parent.getValue(idx - 1));
    if (!child.isLeaf())
      child.insertChild(0, sibling.getChild(sibling.children.length - 1));

    // Update the parent
    parent.setValue(idx - 1, sibling.getValue(sibling.size - 1));

    // Remove the value/child from the sibling
    sibling.removeValues(sibling.size - 1, sibling.size);
    if (!sibling.isLeaf())
      sibling.removeChildren(sibling.children.length - 1, sibling.children.length);

    return this;
  }

  // Borrows a value from the right sibling
  #borrowFromNext(parent, idx) {
    const child = parent.getChild(idx);
    const sibling = parent.getChild(idx + 1);

    // Adds the parent's value to the end of the child
    child.insertValue(child.size, parent.getValue(idx));
    if (!child.isLeaf())
      child.insertChild(child.children.length, sibling.getChild(0));

    // Updates the parent
    parent.setValue(idx, sibling.getValue(0));

    // Removes the value/child from the sibling
    sibling.removeValues(0, 1);
    if (!sibling.isLeaf())
      sibling.removeChildren(0, 1);

    return this;
  }

  clear() {
    this.#clearNode(this.root);
    return this;
  }

  // Recursively clear a node and its children (to help GC)
  #clearNode(node) {
    if (!node) return;

    for (const child of node.children)
      this.#clearNode(child);

    // Clearing references to help GC
    node.values = [];
    node.children = [];
    node.parent = null;
  }

  // In-order traversal (for display/debug)
  traverse(node = this.root, result = []) {
    let i;
 
    for (i = 0; i < node.size; i++) {
      if (!node.isLeaf())
        this.traverse(node.children[i], result);

      result.push(node.getValue(i));
    }
 
    if (!node.isLeaf()) this.traverse(node.children[i], result);
 
    return result;
  }

  *entries() {
    const stack = [];
    let current = this.root;

    while (stack.length > 0 || current) {
      // Reach the leftmost node of the current node, pushing nodes onto the stack
      while (current) {
        stack.push({ node: current, index: 0 });
        current = current.isLeaf() ? null : current.getChild(0);
      }

      const { node, index } = stack.pop();
      yield [node.getValue(index), node, index];

      // If there are more values in this node, advance the index
      if (index + 1 < node.size) {
        stack.push({ node, index: index + 1 });
        current = node.isLeaf() ? null : node.getChild(index + 1);
      } else {
        current = node.isLeaf() ? null : node.getChild(node.size);
      }
    }
  }

  *[Symbol.iterator]() {
    for (const [value] of this.entries())
      yield value;
  }

  checkParentLinks(node = this.root) {
    if (!node) return true;

    for (const child of node.children) {
      if (child.parent !== node) {
        console.error('Parent link is broken');
        return false;
      }
      else if (!this.checkParentLinks(child)) return false;
    }

    return true;
  }

  isBalanced() {
    if (!this.root) return true;

    const order = this.order;
    let leafLevel = null;
    let balanced = true;

    function check(node, level) {
      // Checks the number of keys in the node (except root)
      if (node !== this.root) {
        if (node.size < order - 1 || node.size > 2 * order - 1) {
          balanced = false;
          return;
        }
      }
      // Checks the number of children
      if (!node.isLeaf()) {
        if (node.children.length !== node.size + 1) {
          balanced = false;
          return;
        }
        for (const child of node.children)
          check(child, level + 1);
      } else {
        // All leaves must be at the same level
        if (leafLevel === null) leafLevel = level;
        else if (level !== leafLevel) balanced = false;
      }
    }

    check.bind(this);
    check(this.root, 0);

    return balanced;
  }

  get [Symbol.toStringTag]() {
    return 'BTree';
  }
}
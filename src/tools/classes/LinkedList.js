import isIterable from "../is/isIterable";

export class LinkedListNode {
  #next = null;
  #prev = null;

  constructor(value) {
    this.value = value;
  }

  get next() {
    return this.#next;
  }
  set next(node) {
    console.assert(node === null || node instanceof LinkedListNode, "LinkedListNode.next must be a LinkedListNode or null");
    this.#next = node;
  }

  get prev() {
    return this.#prev;
  }
  set prev(node) {
    console.assert(node === null || node instanceof LinkedListNode, "LinkedListNode.prev must be a LinkedListNode or null");
    this.#prev = node;
  }

  // Removes this node from its current list and makes sure it does not keep references to other nodes anymore
  // so that they can be garbage collected if there are no other references to them
  remove() {
    if (this.prev) {
      this.prev.next = this.next;
      this.prev = null;
    }
    if (this.next) {
      this.next.prev = this.prev;
      this.next = null;
    }
  }

  // Inserts the given node after this node
  insertAfter(node) {
    console.assert(node instanceof LinkedListNode, "LinkedListNode.insertAfter requires a LinkedListNode");
    node.remove();
    node.prev = this;
    node.next = this.next;
    if (this.next) this.next.prev = node;
    this.next = node;
  }

  // Inserts the given node before this node
  insertBefore(node) {
    console.assert(node instanceof LinkedListNode, "LinkedListNode.insertBefore requires a LinkedListNode");
    node.remove();
    node.next = this;
    node.prev = this.prev;
    if (this.prev) this.prev.next = node;
    this.prev = node;
  }

  toString() {
    return `LinkedListNode(${this.value})`;
  }

  get [Symbol.toStringTag]() {
    return 'LinkedListNode';
  }
}

export class LinkedList {
  #head = null;
  #tail = null;

  constructor() {
  }

  get _head() {
    return this.#head;
  }
  set _head(node) {
    console.assert(node === null || node instanceof LinkedListNode, "LinkedList._head must be a LinkedListNode or null");
    this.#head = node;
  }
  get _tail() {
    return this.#tail;
  }
  set _tail(node) {
    console.assert(node === null || node instanceof LinkedListNode, "LinkedList._tail must be a LinkedListNode or null");
    this.#tail = node;
  }

  get size() {
    let count = 0;
    let current = this.#head;

    while (current) {
      count++;
      current = current.next;
    }

    return count;
  }

  get isEmpty() {
    return this.size === 0;
  }

  append(value) {
    const newNode = new LinkedListNode(value);

    if (!this.#head)
      this.#head = newNode;
    else
      this.#tail.insertAfter(newNode);

    this.#tail = newNode;
    return this;
  }

  prepend(value) {
    const newNode = new LinkedListNode(value);

    if (!this.#head)
      this.#tail = newNode;
    else
      this.#head.insertBefore(newNode);

    this.#head = newNode;
    return this;
  }

  from(iterable) {
    console.assert(isIterable(iterable), "LinkedList.from requires an iterable");
    this.clear();

    for (const value of iterable)
      this.append(value);

    return this;
  }

  find(value) {
    let current = this.#head;

    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }

    return null;
  }

  sort(compareFn = (a, b) => a - b) {
    return this.from([...this].sort(compareFn));
  }

  delete(value) {
    if (!this.#head) return this;

    const current = this.find(value);
    if (!current) return this;

    const next = current.next;
    const prev = current.prev;

    current.remove();

    if (current === this.#head) this.#head = next;
    if (current === this.#tail) this.#tail = prev;

    return this;
  }

  // Removes (with delete method) all nodes from the list so that they do not keep references to other nodes anymore
  // so that they can be garbage collected if there are no other references to them
  clear() {
    while (this.#head)
      this.delete(this.#head.value);

    return this;
  }

  *[Symbol.iterator]() {
    let current = this.#head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  toString() {
    return `LinkedList(${[...this].join(' -> ')})`;
  }

  get [Symbol.toStringTag]() {
    return 'LinkedList';
  }
}

export class SortedLinkedList extends LinkedList {
  #compareFn = (a, b) => a - b;

  constructor(compareFn) {
    super();
    if (compareFn) this.#compareFn = compareFn;
  }

  insert(value) {
    if (!this._head)
      this.append(value);                                         // List is empty, just append
    else {
      let current = this._head;

      while (current) {
        if (this.#compareFn(value, current.value) < 0) {
          const newNode = new LinkedListNode(value);

          current.insertBefore(newNode);                          // Insert before `current` node
          if (current === this._head) this._head = newNode;       // Update head if needed

          break;
        }
        current = current.next;
      }

      if (current === null)
        this.append(value);                                       // Value is greater than all existing, append at the end
    }

    return this;
  }

  from(iterable) {
    console.assert(isIterable(iterable), "SortedLinkedList.from requires an iterable");
    this.clear();
    for (const value of iterable)
      this.insert(value);

    return this;
  }

  get [Symbol.toStringTag]() {
    return 'SortedLinkedList';
  }
}
import ExtMap from "./ExtMap";

/**
 * EventEmitter is a class for managing custom events and their listeners.
 * It allows registering, removing, and emitting events with named listeners.
 *
 * @class
 *
 * @example
 * const emitter = new EventEmitter();
 * emitter.on('myEvent', 'listener1', (data) => console.log(data));
 * emitter.emit('myEvent', { foo: 'bar' });
 *
 * @method hasEvent
 * @param {string} eventName - The name of the event.
 * @returns {boolean} True if the event exists, false otherwise.
 *
 * @method on
 * @param {string} eventName - The name of the event.
 * @param {string} listenerName - The unique name for the listener.
 * @param {Function} callbackFn - The callback function to execute when the event is emitted.
 * @returns {EventEmitter} The instance for chaining.
 *
 * @method off
 * @param {string} eventName - The name of the event.
 * @param {string} listenerName - The name of the listener to remove.
 * @returns {EventEmitter} The instance for chaining.
 *
 * @method offAll
 * @param {string} eventName - The name of the event.
 * @returns {EventEmitter} The instance for chaining.
 *
 * @method emit
 * @param {string} eventName - The name of the event.
 * @param {...any} args - Arguments to pass to the listeners.
 * @returns {void}
 *
 * @method listeners
 * @param {string} eventName - The name of the event.
 * @returns {Array<Function>} Array of listener callback functions.
 *
 * @method hasListeners
 * @param {string} eventName - The name of the event.
 * @returns {boolean} True if there are listeners for the event, false otherwise.
 *
 * @property {string} [Symbol.toStringTag] - Returns 'EventEmitter' for Object.prototype.toString
 */
export class EventEmitter {
  #handlersMap = new ExtMap();

  // Cleans up the map by removing empty event listeners
  #cleanupEvents() {
    this.#handlersMap.forEach((listeners, eventName) => {
      if (!listeners.size) this.#handlersMap.delete(eventName);
    });
  }

  hasEvent(eventName) {
    return this.#handlersMap.has(eventName);
  }

  // Adds a listener for the specified event
  on(eventName, listenerName, callbackFn) {
    this
    .#handlersMap
    .getOrSet(eventName, () => new ExtMap())
    .set(listenerName, callbackFn);

    return this;
  }

  // Removes a listener for the specified event
  off(eventName, listenerName) {
    if (this.#handlersMap.has(eventName)) {
      this.#handlersMap.get(eventName).delete(listenerName);

      this.#cleanupEvents();
    }

    return this;
  }

  // Removes a listener for the specified event
  offListener(listenerName) {
    this.#handlersMap.forEach(listeners => listeners.delete(listenerName));
    this.#cleanupEvents();

    return this;
  }

  // Remove all listeners for the specified event
  offEvent(eventName) {
    if (this.#handlersMap.has(eventName))
      this.#handlersMap.get(eventName).clear();

    return this;
  }

  // Removes all listeners
  offAll() {
    this.#handlersMap.clear();
    return this;
  }

  // Fires an event to all registered listeners
  emit(eventName, ...args) {
    if (this.#handlersMap.has(eventName))
      this
      .#handlersMap
      .get(eventName)
      .forEach(callbackFn => callbackFn(...args));
  }

  // Returns all listeners for the specified event
  listeners(eventName) {
    return this.#handlersMap.has(eventName) ? this.#handlersMap.get(eventName).array : [];
  }

  // Checks if there are any listeners for the specified event
  hasListeners(eventName) {
    return !!(this.#handlersMap.get(eventName)?.size);
  }

  get [Symbol.toStringTag]() {
    return 'EventEmitter';
  }
};

/**
 * A mixin that adds event emitter capabilities to a base class.
 * 
 * @template T
 * @param {T} Base - The base class to extend.
 * @returns {T & EventEmitterMixin} - The extended class with event emitter methods.
 * 
 * @class
 * @mixin
 * 
 * @method hasEvent Checks if an event is registered.
 * @method on Registers an event listener.
 * @method off Removes an event listener.
 * @method offAll Removes all listeners for an event.
 * @method emit Emits an event to all registered listeners.
 * @method listeners Returns all listeners for an event.
 * @method hasListeners Checks if there are listeners for an event.
 * 
 * @property {string} [Symbol.toStringTag] Returns 'EventEmitterMixin'.
 * 
 * @example
 * See EventEmitter & CurrentPosition classes
 */
export const EventEmitterMixin = Base => class extends Base {
  #emitter = null;
  constructor(...args) {
    super(...args);
    this.#emitter = new EventEmitter();
  }

  hasEvent(...args)     { return this.#emitter.hasEvent(...args); }
  on(...args)           { this.#emitter.on(...args); return this; }
  off(...args)          { this.#emitter.off(...args); return this; }
  offAll(...args)       { this.#emitter.offAll(...args); return this; }
  emit(...args)         { this.#emitter.emit(...args); return this; }
  listeners(...args)    { return this.#emitter.listeners(...args); }
  hasListeners(...args) { return this.#emitter.hasListeners(...args); }

  get [Symbol.toStringTag]() {
    return 'EventEmitterMixin';
  }
};

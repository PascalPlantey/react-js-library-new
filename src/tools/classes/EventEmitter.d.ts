export type EventEmitterMethods = {
  hasEvent(eventName: string): boolean;
  on(eventName: string, listenerName: string, callbackFn: Function): this;
  off(eventName: string, listenerName: string): this;
  offAll(eventName: string): this;
  emit(eventName: string, ...args: any[]): this;
  listeners(eventName: string): Function[];
  hasListeners(eventName: string): boolean;
};

export declare function EventEmitterMixin<T extends new (...args: any[]) => any>(
  Base: T
): new (...args: ConstructorParameters<T>) => InstanceType<T> & EventEmitterMethods;
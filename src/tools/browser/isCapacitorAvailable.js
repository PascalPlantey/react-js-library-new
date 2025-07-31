/**
 * Returns true if Capacitor is available in the global scope
 * @returns {boolean}
 */
const isCapacitorAvailable = () => typeof window !== "undefined" &&
                                   typeof window.Capacitor !== "undefined";

export default isCapacitorAvailable;
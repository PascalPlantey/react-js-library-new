import { Capacitor } from "@capacitor/core";

/**
 * Returns true if Capacitor is available in the global scope
 * @returns {boolean}
 */
const isCapacitorAvailable = () => typeof window !== "undefined" &&
                                   typeof window.Capacitor !== "undefined" &&
                                   Capacitor.isNativePlatform();

export default isCapacitorAvailable;
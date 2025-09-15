import { useEffect } from "react";

import { Network } from "@capacitor/network";

import useOnMount from "../react/useOnMount";
import useBoolean from "./useBoolean";

import isCapacitorAvailable from "../../tools/browser/isCapacitorAvailable";

/**
 * Custom React hook to track the network connectivity status.
 *
 * Utilizes a boolean state to indicate whether the device is online.
 * Listens for network status changes and updates the state accordingly.
 *
 * @returns {boolean} - `true` if the device is online, `false` otherwise.
 */
const useNetworkStatus = () => {
  const { value: online, setValue: setOnline } = useBoolean(false);

  useEffect(() => {
    if (isCapacitorAvailable()) {
      // Initial status check, then subscribe to changes
      Network.getStatus().then(({ connected }) => setOnline(connected));

      const handler = Network.addListener('networkStatusChange', ({ connected }) => setOnline(connected));

      return () => handler.remove();
    }
    else {
      // Fallback for non-Capacitor environments (e.g., web browsers)
      setOnline(navigator.onLine);

      const updateOnlineStatus = () => setOnline(navigator.onLine);

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }
  }, [setOnline]);

  return online;
};

export default useNetworkStatus;
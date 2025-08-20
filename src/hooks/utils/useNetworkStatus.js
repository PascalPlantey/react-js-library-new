import { useEffect } from "react";

import { Network } from "@capacitor/network";

import useOnMount from "../react/useOnMount";
import useBoolean from "./useBoolean";

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

  useOnMount(() =>
    Network.getStatus().then(({ connected }) => setOnline(connected))
  );

  useEffect(() => {
    const handler =
      Network.addListener('networkStatusChange', ({ connected }) => setOnline(connected));

    return () => handler.remove();
  }, [setOnline]);

  return online;
};

export default useNetworkStatus;
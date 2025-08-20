export default useNetworkStatus;
/**
 * Custom React hook to track the network connectivity status.
 *
 * Utilizes a boolean state to indicate whether the device is online.
 * Listens for network status changes and updates the state accordingly.
 *
 * @returns {boolean} - `true` if the device is online, `false` otherwise.
 */
declare function useNetworkStatus(): boolean;

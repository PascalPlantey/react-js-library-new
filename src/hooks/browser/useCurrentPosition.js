import { useState, useEffect, useRef } from 'react';

/**
 * Custom React hook to track the user's current geolocation position.
 *
 * @param {Object} [options={ enableHighAccuracy: true, timeout: 1000, maximumAge: 30000 }] - Geolocation API options.
 * @param {Array<number>} [dflt=[48.8566, 2.3522]] - Default coordinates [latitude, longitude] to use as initial position.
 * @param {boolean} [active=true] - Whether to actively track the position or not.
 * @returns {{ position: number[], error: string }} An object containing the current position and any error message.
 * 
 * @example
 * // Basic usage
 * const { position, error } = useCurrentPosition();
 * 
 * @example
 * // With custom options
 * const { position, error } = useCurrentPosition({
 *   enableHighAccuracy: true,
 *   timeout: 10000,
 *   maximumAge: 60000
 * }, [45.7640, 4.8357], true);
 */
const useCurrentPosition = (options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }, dflt = [48.8566, 2.3522], active = true) => {
  const [position, setPosition] = useState(dflt);             // Initialize position state with default coordinates
  const [error, setError] = useState(null);                   // Initialize error state to null
  const optionsRef = useRef(options);                         // Store options in a ref to avoid unnecessary re-renders
  const watchIdRef = useRef(null);                            // Store the watch ID in a ref to clear it later

  const handleError = ({ code, message }) => {
    if (code !== 3) // If the error is not a timeout
      console.warn(`Geolocation error ${code}: ${message}`);
    setError(message); // Set error message if geolocation fails
  };

  useEffect(() => {
    if (!navigator.geolocation)
      handleError({ code: 0, message: "La géolocalisation n'est pas supportée par cet appareil" });
    else if (!active) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current); // Clear any existing watch if not active
        watchIdRef.current = null;                            // Reset watch ID
      }
    }
    else {
      const handlePositionChange = ({ coords: { latitude, longitude }}) => {
        setPosition([latitude, longitude]);
        setError(null);                                       // Clear any previous errors
      };

      // Première position rapide
      navigator.geolocation.getCurrentPosition(
        handlePositionChange,                                 // Callback to handle the initial position
        handleError,                                          // Error callback to handle geolocation errors
        {                                                     // Options for the geolocation request
          enableHighAccuracy: false,                          // . moins précis mais plus rapide
          timeout: 10000,                                     // . laisse du temps pour obtenir la position
          maximumAge: 1000 * 60 * 15                          // . accepte une position en cache de 15mn
        }
      );

      // Watch position changes
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionChange,                                 // Callback to handle position changes
        handleError,                                          // Error callback to handle geolocation errors
        optionsRef.current                                    // Use the options from the ref to avoid re-creating the watchPosition call on every render
      );

      return () => navigator.geolocation.clearWatch(watchIdRef.current); // Cleanup function to clear the watch on unmount
    }
  }, [active]); // Re-run effect only when active changes

  return { position, error };
}

export default useCurrentPosition;
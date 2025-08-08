/**
 * Detects if the device has compass capabilities with a timeout-based approach.
 *
 * @param {number} timeoutMs - Maximum time to wait for compass detection (default: 3000ms)
 * @returns {Promise<boolean>} Promise that resolves to true if compass is available, false otherwise
 */
const detectCordovaCompassCapability = (timeoutMs = 3000) => 
  new Promise((resolve) => {
    if (!navigator.compass) {                                         // Check if navigator.compass exists at all
      resolve(false);
      return;
    }

    let watchId,
        timeoutId,
        hasResponded = false;

    const cleanup = () => {                                           // Cleanup function to clear watch and timeout
      if (watchId) navigator.compass.clearWatch(watchId);
      if (timeoutId) clearTimeout(timeoutId);
    };
    
    const respond = result => {                                       // Cordova works, cleanup and resolve
      if (hasResponded) return;
      hasResponded = true;
      cleanup();
      resolve(result);
    };
    
    // If no response after timeout = no compass support
    timeoutId = setTimeout(() => respond(false), timeoutMs);          // Give timeoutMs to get a response
    
    // Test compass with actual watchHeading call
    watchId = navigator.compass.watchHeading(                         // Request heading to check compass/hardware support
      () => respond(true),                                            // Success = compass confirmed
      () => respond(false),                                           // Error = no compass support
      { frequency: 1000 }
    );
  });

export default detectCordovaCompassCapability;

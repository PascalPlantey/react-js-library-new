import { useState, useEffect, useRef } from "react";

import useDeviceCompass from './useDeviceCompass';


/**
 * Calculates the shortest angular difference between two angles.
 *
 * Given a current angle and a target angle (in degrees), returns the minimal
 * signed angle (in degrees) to rotate from the current angle to the target angle.
 * The result is positive for clockwise rotation and negative for counterclockwise rotation.
 *
 * This avoids full 360-degree rotations by calculating the shortest path
 *
 * @param {number} currentAngle - The starting angle in degrees.
 * @param {number} targetAngle - The target angle in degrees.
 * @returns {number} The shortest signed angle difference in degrees.
 */
const getShortestAngle = (currentAngle, targetAngle) => {
  const delta = targetAngle - currentAngle;
  if (delta > 180)
    return delta - 360; // Tourner dans le sens antihoraire
  else if (delta < -180)
    return delta + 360; // Tourner dans le sens horaire

  return delta; // Chemin le plus court
};

/**
 * Custom hook to manage compass logic.
 *
 * @param {boolean} userActive - Whether the user has activated the compass.
 * @param {boolean} appVisible - Whether the app is currently visible.
 * @param {number} throttleMs - Throttle interval for orientation updates.
 * @returns {Object} Compass state and angle.
 */
const useCompass = (userActive, appVisible, throttleMs = 500) => {
  const [isAvailable, setIsAvailable] = useState(false);      // Is the device compass available?
  const [isActive, setIsActive] = useState(true);             // Active on startup to check compass availability

  const angleRef = useRef(0);                                 // Angle returned
  const prevOrientationRef = useRef(0);                       // Previous orientation to calculate the angle difference
  const wasActiveRef = useRef(false);                         // Was the compass active before?

  const orientation = useDeviceCompass(isActive, throttleMs); // Active if isActive is true

  useEffect(() => {
    let timeoutId;

    // The device has compass capabilities if the orientation is defined
    if (orientation !== undefined && !isAvailable) setIsAvailable(true);

    const handleSetActiveState = () => {                      // Change state if needed
      const toBeActive = appVisible && userActive && isAvailable;
      if (toBeActive !== isActive) setIsActive(toBeActive);
    };

    if (orientation === undefined)                            // Give the compass some time to initialize
      timeoutId = setTimeout(handleSetActiveState, 5000);
    else                                                      // If orientation is available initialize immediately
      handleSetActiveState();

    return () => clearTimeout(timeoutId);                     // Just in case the component unmounts
  }, [orientation, appVisible, userActive, isAvailable, isActive]);

  useEffect(() => {
    const wasActive = wasActiveRef.current; // Was the compass active before?
    wasActiveRef.current = isActive;

    if      (!isActive || orientation === undefined) return;
    else if (!wasActive)
      angleRef.current = orientation;                         // Restart angle if the compass was not active before
    else                                                      // Calculate the angle difference if the compass was active before
      angleRef.current += getShortestAngle(prevOrientationRef.current, orientation);

    prevOrientationRef.current = orientation;
  }, [orientation, isActive]);

  return { isAvailable, isActive, angle: angleRef.current };
};

export default useCompass;
import { useState, useEffect, useRef } from "react";

import useDeviceCompass from './useDeviceCompass';

import detectCordovaCompassCapability from "../../tools/browser/detectCordovaCompassCapability";

/**
 * Calculates the shortest angular difference between two angles for compass logic.
 *
 * @param {number} currentOrientation - The starting orientation in degrees.
 * @param {number} targetOrientation - The target orientation in degrees.
 * @returns {number} The compass delta (inverted device delta for compass behavior).
 */
const getCompassRotation = (currentOrientation, targetOrientation) => {
  let deviceDelta = targetOrientation - currentOrientation;

  // Normalize to [-180, 180] for shortest path
  if (deviceDelta > 180) deviceDelta -= 360;
  if (deviceDelta < -180) deviceDelta += 360;

  // For a compass, the needle rotates in the OPPOSITE direction to the device
  // to compensate and stay pointed at true north
  return -deviceDelta;
};

/**
 * Custom hook to manage compass logic with device capability detection
 *
 * @param {boolean} [active=false] - Whether the hook should be active
 * @param {number} throttleMs - Throttle interval for orientation updates
 * @returns {{ isAvailable: boolean|null, isActive: boolean, displayAngle: number, orientation: number }} Compass state
 *
 * where
 * - `isAvailable` indicates if the compass is supported (null = detection in progress, true/false = definitive result),
 * - `isActive` indicates if the compass is currently active,
 * - `displayAngle` is the accumulated angle for CSS rotation,
 * - `orientation` is the latest absolute orientation
 * 
 * @remarks
 * The hook performs a one-time compass capability detection on mount using a Promise-based approach.
 * Once detection is complete, `isAvailable` will be set to true or false definitively.
 * The compass will only be activated if both `active` parameter is true and `isAvailable` is true.
 */
const useCordovaCompass = (active = false, throttleMs = 500) => {
  const [isAvailable, setIsAvailable] = useState(null);       // null = detection in progress, true/false = definitive result
  const [isActive, setIsActive] = useState(false);            // Will be activated only after successful detection
  const [displayAngle, setDisplayAngle] = useState(0);        // Accumulated angle for CSS rotation

  const prevOrientationRef = useRef();                        // Previous orientation to calculate the delta
  const displayAngleRef = useRef(0);                          // Current display angle for reset calculations

  const orientation = useDeviceCompass(isActive, throttleMs); // Active only when compass is confirmed available

  // One-time compass capability detection on mount
  useEffect(() => {
    detectCordovaCompassCapability(3000).then(setIsAvailable);
  }, []);

  // Activate compass only if available and requested
  useEffect(() => {
    setIsActive(active && isAvailable);
  }, [active, isAvailable]);

  // Compass calculation logic
  useEffect(() => {
    if (!isAvailable) return; // Skip if not available

    // Detect when compass becomes inactive (transition from value to undefined)
    if (prevOrientationRef.current !== undefined && orientation === undefined) {
      // Calculate shortest path to mobile north using same logic as compass rotations
      const resetDelta = getCompassRotation(0, displayAngleRef.current);

      setDisplayAngle(prev => {
        const newAngle = prev + resetDelta;
        displayAngleRef.current = newAngle;
        return newAngle;
      });
      
      prevOrientationRef.current = undefined;                 // Mark as reset
      return;
    }

    if (!isActive || orientation === undefined) return;       // Not active or no orientation data
    if (prevOrientationRef.current === orientation) return;   // Avoid strict mode re-renders

    // Normal compass logic for geographical north
    const result = getCompassRotation(prevOrientationRef.current || 0, orientation);

    if (Math.abs(result) >= 1)                                // Difference >= 1 degree, state update
      setDisplayAngle(prev => {
        const newAngle = prev + result;
        displayAngleRef.current = newAngle;                   // Keep ref in sync
        return newAngle;
      });

    prevOrientationRef.current = orientation;
  }, [orientation, isActive, isAvailable]);

  return { isAvailable, isActive, displayAngle, orientation };
};

export default useCordovaCompass;

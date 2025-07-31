export default useSpeedoMeter;
/**
 * Hook React pour calculer la vitesse instantanée à partir de positions GPS successives.
 * @param {GeoCoordinates} position - Objet { latitude, longitude, timestamp }
 * @returns {number} Vitesse en m/s (ou null si pas assez de données)
 */
declare function useSpeedoMeter(position: GeoCoordinates): number;
import GeoCoordinates from "../../tools/classes/GeoCoordinates.js";

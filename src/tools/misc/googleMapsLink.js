/**
 * Generates a Google Maps search link for a given address.
 *
 * @param {Object} params - The address parameters.
 * @param {string} [params.street] - The street address.
 * @param {string} [params.zip] - The postal/ZIP code.
 * @param {string} [params.city] - The city name.
 * @param {string} [params.country] - The country name.
 * @returns {string|null} The Google Maps search URL for the address, or null if all fields are missing.
 */
const googleMapsLink = ({ street, zip, city, country }) => {
  if (!street && !zip && !city && !country) return null;

  const fullAddress = `${street || ''}, ${zip || ''} ${city || ''}, ${country || ''}`.trim().replace(/^[, ]+|[, ]+$/g, '');
  const encodedAddress = encodeURIComponent(fullAddress).replace(/%20/g, '+');
  const addressLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  return addressLink;
};

export default googleMapsLink;
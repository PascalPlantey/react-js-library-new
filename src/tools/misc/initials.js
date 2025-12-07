/**
 * Generates the initials from a given name string, ignoring common prepositions and articles.
 *
 * @param {string} name - The full name to extract initials from.
 * @returns {string} The initials in uppercase, excluding ignored words.
 */
const initials = name => {
  if (!name) return "";

  // Liste des mots à ignorer (prépositions, articles, etc.)
  const ignore = ["de", "la", "le", "du", "des", "d'", "l'", "et", "a", "au", "aux", "en", "sur", "sous", "chez"];

  return name
    .split(/[\s-]+/) // Sépare par espace ou tiret
    .filter(word => word && !ignore.includes(word.toLowerCase()))
    .map(word => word[0].toUpperCase())
    .join("");
};

export default initials;
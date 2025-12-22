// Validation simple d'URL (http/https)
const isWebsiteAddress = (value = "") =>
  !value || /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]+)?(\/.*)?$/.test(value);

export default isWebsiteAddress;
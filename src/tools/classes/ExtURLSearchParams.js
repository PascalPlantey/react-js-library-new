/**
 * ExtURLSearchParams is a utility class to manage URL search parameters.
 * It wraps the native URLSearchParams and provides methods to get, set, and reset parameters,
 * while also updating the browser's URL without reloading the page.
 */
export default class ExtURLSearchParams {
  constructor(searchParams = window.location.search) {
    this.searchParams = new URLSearchParams(searchParams);
  }

  /**
   * Get a URL query parameter by key
   * @param {string} key - The query parameter key
   * @returns {string|null} The URL query parameter
   */
  get(key) {
    return this.searchParams.get(key);
  }

  /**
   * Set a URL query parameter by key and update the browser URL
   * @param {string} key - The query parameter key
   * @param {string} value - The query parameter value
   */
  set(key, value) {
    this.searchParams.set(key, value);
    const newUrl = window.location.pathname + (this.searchParams.toString() ? '?' + this.searchParams.toString() : '');
    window.history.replaceState({}, document.title, newUrl);
  }

  /**
   * Remove all URL query parameters and update the browser URL
   */
  reset() {
    this.searchParams = new URLSearchParams('');
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
}

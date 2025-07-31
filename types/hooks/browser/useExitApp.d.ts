export default useExitApp;
/**
 * Custom React hook that returns a callback to exit the application.
 *
 * The returned function checks if the global `App` object and its `exitApp` method exist,
 * and calls `App.exitApp()` to exit the app if available.
 *
 * @returns {Function} Callback function to exit the application.
 */
declare function useExitApp(): Function;

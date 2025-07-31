export default useInterval;
/**
 * Execute callback every interval ms
 * @param {function} callback Function to be executed () => any
 * @param {number} [interval=1000] Render every interval ms
 * @param {boolean} [immediately=true] Start immediately?
 * @returns {object} { working, toggle: () => void, stop: () => void, start: () => void }
 */
declare function useInterval(callback: Function, interval?: number, immediately?: boolean): object;

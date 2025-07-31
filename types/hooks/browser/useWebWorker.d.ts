export default useWebWorker;
/**
 * Simple hook built around the WebWorker. To avoid losing state updates in case of multiple runs,
 * results are queued is an array (`state.data`)
 * @param {WebWorkerFunction} code Function to be executed when a message is received
 * @returns {useWebWorkerResult} Execution status
 * @memberof Hooks#
 */
declare function useWebWorker(code: WebWorkerFunction): useWebWorkerResult;

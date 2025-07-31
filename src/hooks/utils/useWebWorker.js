import { useRef, } from 'react';

import useObject from './useObject';
import { useOnDismount } from '../react';

import { Enum, WebWorker } from '../../tools/classes';

/**
 * _Worker Specialized Worker to enable the definition of the useWorker
 */
class _Worker extends WebWorker {
  /**
   * Define the worker code using the parents code
   * @param {function} onMessage Function receiving the parent message
   * @description if your code is "value => value + 1" the code set in the worker will be:
   *  onmessage = msg => {
   *    const action = value => value + 1;
   *    const { data } = msg;                                   // Extracts the data received from message
   *    const result = action(data);                            // Perform parent defined action
   *    postMessage(result);                                    // Send back result to useWorker
   *  }
   */
  constructor(onMessage) {
    const code = `msg => {
      const action = ${onMessage.toString()};
      const { data } = msg;
      const result = action(data);
      postMessage(result);
    }`;
    super(code);
  }

  /**
   * Changed the default object type name visible through Object.prototype.toString.call
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return '_Worker';
  }
};

/**
 * Simple hook built around the WebWorker. To avoid losing state updates in case of multiple runs,
 * results are queued is an array (`state.data`)
 * @param {WebWorkerFunction} code Function to be executed when a message is received
 * @returns {useWebWorkerResult} Execution status
 * @memberof Hooks#
 */
const useWebWorker = code => {
  const status = new Enum('useWebWorker', ['IDLE', 'RUNNING', 'DEAD', 'undefined']);
  const { object : state, assign } = useObject({
    execStatus: status.IDLE, // Current execution status
    success: undefined,
    queueCount: 0,
    comment: '',
    evt: undefined,
    data: [],
    run,
    kill
  });


  /**
   * We need to build a Worker at startup if user wants to run after a kill (after a 'kill' the worker cannot run anymore)
   * @returns {Worker} new Worker prepared
   * @description We use worker.onmessage and onerror functions to manage the state of execution
   */
  const initWorker = () => {
    const worker = new _Worker(code);

    worker.onmessage = msg => {                          // Receives the message containing the result returned by the provided code
      const { data : result } = msg;                     // Get the result for use in the state update
      const { queueCount, data } = state;
      assign({ execStatus: queueCount > 1 ? status.RUNNING : status.IDLE, success: true, queueCount: queueCount - 1, comment: 'execution succeeded', evt: undefined, data: [...data, result] });
    };
  
    worker.onerror = evt => {                             // Receives the event fired in case of an error when excuting the worker code
      const { queueCount } = state;
      assign({ execStatus: queueCount > 1 ? status.RUNNING : status.IDLE, success: false, queueCount: queueCount - 1, comment: 'last execution failed', evt });
    };

    return worker;
  };

  const workerRef = useRef(initWorker());

  const run = param => {                                  // Parent needs the worker code to run, using the 'param' parameter value
    const { execStatus, queueCount } = state;

    switch(execStatus) {
      case status.IDLE:                                   // Worker is idle, we can run the code
        workerRef.current.postMessage(param);             // Request execution of worker code, with an empty data array
        assign({ execStatus: status.RUNNING, success: undefined, queueCount: 1, comment: 'message sent for execution', data: [], evt: undefined });
        break;

      case status.RUNNING:                                // Worker has a queue of incoming messages, enabling to request a run while it is running,
        workerRef.current.postMessage(param);             // the new run will be queued
        assign({ queueCount: queueCount + 1, comment: 'warning, multiple executions queued', evt: undefined });
        break;

      case status.DEAD:                                   // Worker is dead, we need to create a new worker
        workerRef.current = initWorker();                 // Trying to run but the worker is 'DEAD' (has been 'killed'), we need to create
        workerRef.current.postMessage(param);             // a new worker and request execution
        assign({ execStatus: status.RUNNING, success: undefined, queueCount: 1, comment: 'revived a dead worker', data: [], evt: undefined });
        break;

      default:
        assign({ execStatus: status.undefined, data: [], evt: undefined });
        break;                                            // Should never happen, but just in case
    }
  };

  const kill = () => {                                    // Stop worker activity and definitively make it unusable
    workerRef.current?.terminate();
    assign({ execStatus: 'DEAD', success: undefined, queueCount: 0, comment: 'worker terminated', data: [], evt: undefined });
  };

  useOnDismount(kill);                                    // Cleanup on unmount, kill the worker

  return state;
};

export default useWebWorker;
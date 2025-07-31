/**
 * @private
 * @param {string} text JS code to be used by the webworker
 * @returns {string} JS code as a temporary URL
 */
const makeScriptUrl = text => URL.createObjectURL(new Blob([text], { type: "application/javascript" }));

/**
 * @extends Worker
 * Basic worker class. Wraps a provided function which receives a message, executes some process, and sends
 * back result through `postMessage(result)`. By default the result is received by `worker.onmessage` which
 * console logs the result. You can override the default behavior by adding your `onmessage` function.  
 * If there is an error in the provided function, the `onerror` function (which can also be overriden)
 * will display the event containing details about the error
 */
class WebWorker extends Worker {
  /**
   * Constructs the basic WebWorker. See [Mozilla]{@link https://developer.mozilla.org/en-US/docs/Web/API/Worker}
   * for reference
   * @param {WebWorkerFunction} onMessage Function to be executed after a worker.postMessage call
   * @example
   *  const worker = new WebWorker(msg => {
   *    // data sent is located in msg.data
   *    // do whatever process/calculation
   *    postMessage(result);                // Send back result
   *  });
   *  worker.onmessage = msg => {           // Executed after the worker code above calls postMessage(result)
   *    const { data } = msg;
   *    setResult(data);
   *  };
   *  worker.postMessage(2);                // Request execution of the code provided above (new WebWorker(msg => ...))
   */
  constructor(onMessage) {
    const code = `onmessage = ${onMessage.toString()}`;         // Set the function as Worker onmessage function
    super(makeScriptUrl(code));                                 // From string to url

    // Install default handlers that can be changed by parent: new Worker(code).onmessage(msg => 'a');
    /**
     * Default function when a message is received by the worker. The main process should overwrite this function
     * to do whatever calculations on the received message
     * @param {WebWorkerMessage} msg Message sent by main process
     * @returns {void}
     */
    this.onmessage = msg => console.log('Message received from Worker', msg);

    /**
     * Default function called when an error is received by the worker
     * @param {ErrorEvent} evt Error description
     * @returns {void}
     */
    this.onerror = evt => {
      console.error('Error occured in Worker', evt);
      evt.preventDefault();                                     // Stop event propagation
    };
  }

  /**
   * Changed the default object type name visible through Object.prototype.toString.call
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return 'WebWorker';
  }
};

export default WebWorker;
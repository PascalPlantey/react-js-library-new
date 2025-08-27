import React, { useEffect, useRef, useState } from 'react';

import './App.css';

import { useBoolean, useNewClassRef } from './hooks';
import { GeoCoordinates, WebWorker } from './tools';
import CurrentPosition from './tools/classes/CurrentGpsPosition';

const workerFunction = ({ data }) => {
  console.log('worker, received msg:', data);
  const [i, j] = data;

  let result = 0;
  for(let a = 0; a < i; a++)
    for(let b = 0; b < j; b++)
      result += a;
  postMessage("Result: " + [i, j, result]);
  // Worker logic here
}

function App() {
  const { value: isVisible, setTrue, setFalse, toggle } = useBoolean(false);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [coordinates, setCoordinates] = useState();
  const worker = useNewClassRef(() => new WebWorker(workerFunction));
  worker.onmessage = msg => {
    console.log('Main thread, received msg from worker:', msg);
  };

  useEffect(() => {
    worker.postMessage([i, j]); // Trigger the worker function
  }, [i, j, worker]);

  useEffect(() => {
    if (!coordinates) {
      const position = new CurrentPosition(false)
        .on('positionchange', 'App', args => {
          console.log('Position changed:', args);
          setCoordinates(new GeoCoordinates(args));
        })
        .startWatching();
      return () => position.destroy?.();
    }
  }, [isVisible, setFalse, setTrue]);

  console.log('Current Position:', coordinates?.value, 'visible', isVisible);
  return (
    <div className="App">
      <header className="App-header">
        <h1>React JS Library Demo</h1>
        
        <div className="demo-section">
          <h2>useBoolean Hook Demo</h2>

          <div className="example">
            {coordinates
              ? (<h3>Coordinates: {coordinates.latitude}, {coordinates.longitude}</h3>)
              : (<h3>Waiting for GPS coordinates...</h3>)
            }
          </div>
          <div className="example">
            <h3>Visibility Example</h3>

            <input type="text" value={i} onChange={e => setI(e.target.value)} />
            <input type="text" value={j} onChange={e => setJ(e.target.value)} />

            <p>Content is {isVisible ? 'visible' : 'hidden'}</p>
            {isVisible && <div className="content">🎉 This content is now visible!</div>}
            <div className="buttons">
              <button onClick={setTrue}>Show</button>
              <button onClick={setFalse}>Hide</button>
              <button onClick={toggle}>Toggle</button>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}

export default App;

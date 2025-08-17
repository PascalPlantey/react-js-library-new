import React, { useEffect, useRef } from 'react';

import './App.css';

import { useBoolean } from './hooks';
import { GeoCoordinates } from './tools';
import CurrentPosition from './tools/classes/CurrentGpsPosition';

function App() {
  const { value: isVisible, setTrue, setFalse, toggle } = useBoolean(false);
  const coordinates = useRef();

  useEffect(() => {
    if (!coordinates.current) {
      coordinates.current = new CurrentPosition(false)
        .startWatching()
        .on('positionchange', 'App', args => {
          console.log('Position changed:', args);
          isVisible ? setFalse() : setTrue();
      });
      return () => coordinates.current?.destroy?.();
    }
  }, [isVisible, setFalse, setTrue]);

  console.log('Current Position:', coordinates.current?.value, 'visible', isVisible);
  return (
    <div className="App">
      <header className="App-header">
        <h1>React JS Library Demo</h1>
        
        <div className="demo-section">
          <h2>useBoolean Hook Demo</h2>

          <div className="example">
            {coordinates.current
              ? (<h3>Coordinates: {coordinates.current.latitude}, {coordinates.current.longitude}</h3>)
              : (<h3>Waiting for GPS coordinates...</h3>)
            }
          </div>
          <div className="example">
            <h3>Visibility Example</h3>
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

import React, { useEffect, useState } from 'react';

import './App.css';

import { useBoolean } from './hooks';
import { useGpsCoordinates } from './hooks/browser';
import { useSpeedometer } from './hooks/utils';
import { GeoCoordinates } from './tools';

function App() {
  const { value: isVisible, setTrue, setFalse, toggle } = useBoolean(false);
  const {coordinates} = useGpsCoordinates();
  const speed = useSpeedometer(coordinates, 30, true);

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
            <h3>Speed: {speed} km/h</h3>
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

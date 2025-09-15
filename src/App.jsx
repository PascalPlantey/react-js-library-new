import React, { useEffect, useRef, useState } from 'react';

import './App.css';

import { useBoolean } from './hooks';
import { GeoCoordinates } from './tools';
import CurrentPosition from './tools/classes/CurrentGpsPosition';
import { BTree } from './tools/classes/BTree';

const values = [1, 5, 0, 3, 8, 5, 2, 7, 4, 6, 15, 12, 10, 11, 9, 14, 13, 20, 18, 16, 19, 17, 25, 22, 30, 28, 26, 27, 24, 23, 29];

function App() {
  const { value: isVisible, setTrue, setFalse, toggle } = useBoolean(false);
  const [coordinates, setCoordinates] = useState();

  const bTree = new BTree((a, b) => a - b, 3);
  values.forEach((value) => {
    bTree.insert(value);
    console.log('BTree:', bTree.traverse());
  });
  console.log('BTree created from values (in-order):', bTree.traverse().map(node => node.value));
  console.log('BTree debug structure:', bTree.isBalanced(), bTree.checkParentLinks());
  console.log('BTree height:', bTree.height);
  console.log('BTree size:', bTree.size);

  values.forEach((value) => {
    bTree.remove(value);
    console.log('BTree:', bTree.traverse());
  });
  console.log('BTree created from values (in-order):', bTree.traverse().map(node => node.value));
  console.log('BTree debug structure:', bTree.isBalanced(), bTree.checkParentLinks());
  console.log('BTree height:', bTree.height);
  console.log('BTree size:', bTree.size);

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
/*
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
*/
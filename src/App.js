import React from 'react';
import './App.css';
import WebServerHandler from './webServerHandler';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WebServerHandler /> {/* Render WebServerHandler here */}
      </header>
    </div>
  );
}

export default App;
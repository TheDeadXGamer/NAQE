import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import MapView from './components/MapView';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
      <div className="App">
        <nav>
          <button onClick={() => setCurrentView('home')}>Startsida</button>
          <button onClick={() => setCurrentView('map')}>Karta</button>
        </nav>
        <main>
          {currentView === 'home' && <Home />}
          {currentView === 'map' && <MapView />}
        </main>
      </div>
  );
}

export default App;
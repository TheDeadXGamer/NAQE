import React, { useState } from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';

function App() {
  const [currentView, setCurrentView] = useState('search');

  return (
      <div className="App">
        <nav>
          <button onClick={() => setCurrentView('search')}>Startsida</button>
          <button onClick={() => setCurrentView('map')}>Karta</button>
        </nav>
        <main>
          {currentView === 'search' && <Search />}
          {currentView === 'map' && <MapView />}
        </main>
      </div>
  );
}

export default App;
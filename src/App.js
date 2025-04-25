import React, { useState, useEffect} from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';


function App() {
  const [currentView, setCurrentView] = useState('map');

  return (
    <div className="App">
      <nav>
        <button onClick={() => setCurrentView('map')}>Karta</button>
        <button onClick={() => setCurrentView('search')}>Sök</button>
      </nav>
      <main>
        {currentView === 'search' && <Search />}
        {currentView === 'map' && <MapView />}
      </main>
    </div>
  );
}

export default App;
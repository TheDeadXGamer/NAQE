import React, { useState} from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';
import Favourites from './components/Favourites';


function App() {
  const [currentView, setCurrentView] = useState('map');

  return (
    <div className="App">
      <nav>
        <button onClick={() => setCurrentView('map')}
          className={currentView === 'map' ? 'active' : ''}
        >Karta
        </button>
        <button onClick={() => setCurrentView('search')}
          className={currentView === 'search' ? 'active' : ''}
        >Sök
        </button>
        <button onClick={() => setCurrentView('favourites')}
          className={currentView === 'favourites' ? 'active' : ''}
        >Favoriter
        </button>
      </nav>
      <main>
        {currentView === 'search' && <Search />}
        {currentView === 'map' && <MapView />}
        {currentView === 'favourites' && <Favourites />}
      </main>
    </div>
  );
}

export default App;
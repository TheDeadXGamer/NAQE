import React, { useState} from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';
import Favourites from './components/Favourites';
import RecentPlaces from './components/RecentPlaces';


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
        <button onClick={() => setCurrentView('recentPlaces')} 
        className={currentView === 'recentPlaces' ? 'active' : ''}
        >Senast Visade
        </button>
      </nav>
      <main>
        {currentView === 'search' && <Search />}
        {currentView === 'map' && <MapView />}
        {currentView === 'favourites' && <Favourites />}
        {currentView === 'recentPlaces' && <RecentPlaces />}
      </main>
    </div>
  );
}

export default App;
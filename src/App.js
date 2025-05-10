import React, { use, useEffect, useState} from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';
import Favourites from './components/Favourites';
import RecentPlaces from './components/RecentPlaces';
import { Badplatser } from './components/havApi';


function App() {
  const [currentView, setCurrentView] = useState('loading');
  const badplatser = new Badplatser();

  useEffect(() => {
    const fetchData = async () => {
    await badplatser.initializeBadplatserInstance(); // Initialize the instance
    };
    fetchData().then(() => setCurrentView('map')); // Set the default view after data is fetched
  }, []); // Only runs once

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
        {currentView === 'loading' && <span class="loader"></span>}
        {currentView === 'search' && 
        <Search badplatser={badplatser}/>}
        {currentView === 'map' && 
        <MapView badplatser={badplatser}/>}
        {currentView === 'favourites' && <Favourites />}
        {currentView === 'recentPlaces' && <RecentPlaces />}
      </main>
    </div>
  );
}

export default App;
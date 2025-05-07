import React, { useState} from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';
import Favourites from './components/Favourites';
import RecentPlaces from './components/RecentPlaces';
import Login from './components/Login';

import { saveFavorites } from './components/AccountCookies';


function App() {
  const [currentView, setCurrentView] = useState('login'); // Default view is 'login'
  const [isLoggedIn, setIsLoggedIn] = useState(null); // State to manage login status, is null or username

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
        <button onClick={() => {if (isLoggedIn) {setCurrentView('favourites')}}}
          className={`${currentView === 'favourites' ? 'active' : ''} ${isLoggedIn === null ? 'loggedOut' : ''}`.trim()}
        >Favoriter
        </button>
        <button onClick={() => setCurrentView('recentPlaces')} 
        className={`${currentView === 'recentPlaces' ? 'active' : ''} ${isLoggedIn === null ? 'loggedOut' : ''}`.trim()}
        >Senast Visade
        </button>
        <button onClick={() => { if(isLoggedIn){ saveFavorites(isLoggedIn); setCurrentView('login'); setIsLoggedIn(null); } }}
          className={isLoggedIn === null ? 'loggedOut' : ''}
        >Logga ut
        </button>
      </nav>
      <main>
        {currentView === 'login' && <Login setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView} />}
        {currentView === 'search' && <Search />}
        {currentView === 'map' && <MapView />}
        {currentView === 'favourites' && <Favourites />}
        {currentView === 'recentPlaces' && <RecentPlaces />}
      </main>
    </div>
  );
}

export default App;
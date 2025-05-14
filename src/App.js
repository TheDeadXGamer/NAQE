import React, { use, useEffect, useState} from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';
import Favourites from './components/Favourites';
import RecentPlaces from './components/RecentPlaces';
import Login from './components/Login';
import { Badplatser } from './components/havApi';


import { saveFavorites } from './components/AccountCookies';


function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [isLoggedIn, setIsLoggedIn] = useState(null); // State to manage login status, is null or username

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
        {currentView === 'loading' && <span class="loader"></span>}
        {currentView === 'search' && <Search badplatser={badplatser}/>}
        {currentView === 'map' && <MapView badplatser={badplatser}/>}
        {currentView === 'favourites' && <Favourites />}
        {currentView === 'recentPlaces' && <RecentPlaces />}
      </main>
    </div>
  );
}

export default App;
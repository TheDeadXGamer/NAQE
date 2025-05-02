import React, { useState} from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';
import Favourites from './components/Favourites';
import Login from './components/Login';


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
        <button onClick={() => setCurrentView('favourites')}
          className={`${currentView === 'favourites' ? 'active' : ''} ${isLoggedIn === null ? 'loggedOut' : ''}`.trim()}
        >Favoriter
        </button>
        <button onClick={() => { setCurrentView('login'); setIsLoggedIn(null); }}
          className={isLoggedIn === null ? 'loggedOut' : ''}
        >Logga ut
        </button>
      </nav>
      <main>
        {currentView === 'search' && <Search />}
        {currentView === 'map' && <MapView />}
        {currentView === 'favourites' && <Favourites />}
        {currentView === 'login' && <Login setIsLoggedIn={setIsLoggedIn} setCurrentView={setCurrentView} />}
      </main>
    </div>
  );
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css';
import { FavoritesProvider } from './context/FavouritesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </React.StrictMode>
);

reportWebVitals();
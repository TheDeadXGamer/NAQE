import React from 'react';
import { useFavorites } from '../context/FavouritesContext';


const Favourites = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="favourites">
      <h1>Your Favourites</h1>
      {favorites.length > 0 ? (
        <ul>
        {favorites.map(({ id, name, municipality, position, stats }) => (
          <li key={id}>
            <h3>{name}</h3>
            <p><strong>Municipality:</strong> {municipality}</p>
            <p><strong>Coordinates:</strong> {position.latitude}, {position.longitude}</p>
            {stats ? (
              <>
                <p><strong>Last Sample:</strong> {new Date(stats.takenAt).toLocaleDateString()}</p>
                <p><strong>Water Temp:</strong> {stats.waterTemp} °C</p>
                <p><strong>E. coli:</strong> {stats.escherichiaColiPrefix}{stats.escherichiaColiCount} ({stats.escherichiaColiAssessIdText})</p>
                <p><strong>Enterococci:</strong> {stats.intestinalEnterococciPrefix}{stats.intestinalEnterococciCount} ({stats.intestinalEnterococciAssessIdText})</p>
                <p><strong>Assessment:</strong> {stats.sampleAssessIdText}</p>
                {stats.pollutionTypeIdText && (
                  <p><strong>Pollution:</strong> {stats.pollutionTypeIdText}</p>
                )}
              </>
            ) : (
              <p>No stats available.</p>
            )}
            <button onClick={() => removeFavorite(id)}>Remove</button>
          </li>
        ))}
      </ul>
      ) : (
        <p>No favorites added yet.</p>
      )}
    </div>
  );
};

export default Favourites;
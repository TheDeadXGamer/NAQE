import React from 'react';
import { useRecentPlaces } from '../context/RecentPlacesContext';

const RecentPlaces = () => {
  const { recentPlaces } = useRecentPlaces();

  return (
    <div className="recent-places">
      <h1>Recently Viewed Places</h1>
      {recentPlaces.length > 0 ? (
        <ul>
          {recentPlaces.map(({ id, name, municipality, position, stats }) => (
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
            </li>
          ))}
        </ul>
      ) : (
        <p>No places viewed recently.</p>
      )}
    </div>
  );
};

export default RecentPlaces;
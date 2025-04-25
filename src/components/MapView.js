import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Badplatser } from './havApi';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [beaches, setBeaches] = useState([]);
  const badplatser = new Badplatser();

  useEffect(() => {
    const fetchData = async () => {
      await badplatser.initializeBadplatserInstance();
      const mapInstance = badplatser.getInstance();
      const beachArray = Array.from(mapInstance.entries()).map(([id, [name, municipality, position]]) => ({
        id,
        name,
        municipality,
        position,
      }));
      setBeaches(beachArray);
    };
    fetchData();
  }, []);

  return (
    <div className="map">
      <h1>Badplatser i Sverige</h1>
      <MapContainer center={[60.1282, 18.6435]} zoom={5} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {beaches.map(({ id, name, municipality, position }) => {
          if (!position) return null;
          return (
            <Marker key={id} position={[position.latitude, position.longitude]}>
              <Popup>
                <BeachPopupContent id={id} name={name} municipality={municipality} position={position} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

const BeachPopupContent = ({ id, name, municipality, position }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const badplatser = new Badplatser();
      const res = await badplatser.fetchResultsById(id);
      setResults(res.length > 0 ? res[0] : null);
    };
    fetchResults();
  }, [id]);

  return (
    <div>
      <h3>{name}</h3>
      <p><strong>Kommun:</strong> {municipality}</p>
      <p><strong>Koordinater:</strong> {position.latitude}, {position.longitude}</p>
      {results ? (
        <>
          <p><strong>Senaste prov:</strong> {new Date(results.takenAt).toLocaleDateString()}</p>
          <p><strong>Vattentemp:</strong> {results.waterTemp} °C</p>
          <p><strong>E. coli:</strong> {results.escherichiaColiPrefix}{results.escherichiaColiCount} ({results.escherichiaColiAssessIdText})</p>
          <p><strong>Enterokocker:</strong> {results.intestinalEnterococciPrefix}{results.intestinalEnterococciCount} ({results.intestinalEnterococciAssessIdText})</p>
          <p><strong>Bedömning:</strong> {results.sampleAssessIdText}</p>
          {results.pollutionTypeIdText && (
            <p><strong>Föroreningar:</strong> {results.pollutionTypeIdText}</p>
          )}
        </>
      ) : (
        <p>Laddar data...</p>
      )}
    </div>
  );
};

export default MapView;
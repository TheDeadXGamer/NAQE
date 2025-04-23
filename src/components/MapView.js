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
  const [selectedBeach, setSelectedBeach] = useState(null);
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
            <Marker
              key={id}
              position={[position.latitude, position.longitude]}
              eventHandlers={{
                click: () => setSelectedBeach({ id, name, municipality, position }),
              }}
            >
              <Popup>{name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {selectedBeach && (
        <div className="info-box">
          <h2>{selectedBeach.name}</h2>
          <p>
            <strong>Kommun:</strong> {selectedBeach.municipality}
          </p>
          <p>
            <strong>Koordinater:</strong> {selectedBeach.position.latitude}, {selectedBeach.position.longitude}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;
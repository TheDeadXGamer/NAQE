import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Badplatser } from './havApi';
import 'leaflet/dist/leaflet.css';

// Marker icons
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const grayIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getIconByAssessment = (assessment) => {
  if (!assessment) return grayIcon;
  const normalized = assessment.trim().toLowerCase();
  switch (normalized) {
    case 'tjänligt':
      return greenIcon;
    case 'tjänligt m. anm.':
      return yellowIcon;
    case 'otjänligt':
      return redIcon;
    default:
      return blueIcon;
  }
};

const MapView = () => {
  const [beaches, setBeaches] = useState([]);
  const badplatser = new Badplatser();

  useEffect(() => {
    const fetchData = async () => {
      await badplatser.initializeBadplatserInstance();
      const mapInstance = badplatser.getInstance();

      const initialBeachArray = Array.from(mapInstance.entries()).map(
        ([id, [name, municipality, position]]) => ({
          id,
          name,
          municipality,
          position,
          assessment: null,
        })
      );

      setBeaches(initialBeachArray);

      // Progressive fetching of assessments
      for (const beach of initialBeachArray) {
        try {
          const results = await badplatser.fetchResultsById(beach.id);
          const latestResult = results.length > 0 ? results[0] : null;
          const updatedAssessment = latestResult?.sampleAssessIdText || null;

          setBeaches((prev) =>
            prev.map((b) =>
              b.id === beach.id ? { ...b, assessment: updatedAssessment } : b
            )
          );
        } catch (error) {
          console.error(`Error fetching results for ${beach.id}`, error);
        }
      }
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
        <MarkerClusterGroup chunkedLoading>
          {beaches.map(({ id, name, municipality, position, assessment }) => {
            if (!position) return null;
            const icon = getIconByAssessment(assessment);
            return (
              <Marker
                key={id}
                position={[position.latitude, position.longitude]}
                icon={icon}
              >
                <Popup>
                  <BeachPopupContent
                    id={id}
                    name={name}
                    municipality={municipality}
                    position={position}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
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
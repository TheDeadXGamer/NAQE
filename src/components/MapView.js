import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Badplatser } from './havApi';
import 'leaflet/dist/leaflet.css';

const greenIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const yellowIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const redIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const blueIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const grayIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

const getIconByAssessment = (assessment) => {
  if (!assessment) return grayIcon;
  const normalized = assessment.trim().toLowerCase();
  switch (normalized) {
    case 'tjänligt': return greenIcon;
    case 'tjänligt m. anm.': return yellowIcon;
    case 'otjänligt': return redIcon;
    default: return blueIcon;
  }
};

const MapView = () => {
  const [beaches, setBeaches] = useState([]);
  const [assessments, setAssessments] = useState(new Map());
  const badplatser = new Badplatser();

  useEffect(() => {
    const fetchData = async () => {
      await badplatser.initializeBadplatserInstance();
      const mapInstance = badplatser.getInstance();

      const beachArray = Array.from(mapInstance.entries()).map(
        ([id, [name, municipality, position]]) => ({
          id,
          name,
          municipality,
          position
        })
      );
      setBeaches(beachArray);
    };

    fetchData();
  }, []);

  const handleMarkerClick = async (id) => {
    if (assessments.has(id)) return; // Already fetched

    try {
      const results = await badplatser.fetchResultsById(id);
      const latest = results?.[0]?.sampleAssessIdText || null;
      setAssessments(prev => new Map(prev).set(id, latest));
    } catch (error) {
      console.error('Error fetching assessment:', error);
    }
  };

  return (
    <div className="map">
      <h1>Badplatser i Sverige</h1>

      <div style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '5px', maxWidth: '300px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h4>Färgförklaring</h4>
        <p style={{ fontSize: '0.9em', marginBottom: '8px' }}>
          Klicka på en markör för att se badplatsens tjänlighet.
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><img src={greenIcon.options.iconUrl} alt="Grön" width="12" style={{ marginRight: 6 }} /> Tjänligt</li>
          <li><img src={yellowIcon.options.iconUrl} alt="Gul" width="12" style={{ marginRight: 6 }} /> Tjänligt m. anm.</li>
          <li><img src={redIcon.options.iconUrl} alt="Röd" width="12" style={{ marginRight: 6 }} /> Otjänligt</li>
          <li><img src={blueIcon.options.iconUrl} alt="Blå" width="12" style={{ marginRight: 6 }} /> Uppgift saknas</li>
          <li><img src={grayIcon.options.iconUrl} alt="Grå" width="12" style={{ marginRight: 6 }} /> Laddar...</li>
        </ul>
      </div>

      <MapContainer center={[60.1282, 18.6435]} zoom={5} style={{ height: '600px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <MarkerClusterGroup chunkedLoading>
          {beaches.map(({ id, name, position }) => {
            if (!position) return null;
            const assessment = assessments.get(id);
            const icon = getIconByAssessment(assessment);

            return (
              <Marker
                key={id}
                position={[position.latitude, position.longitude]}
                icon={icon}
                eventHandlers={{ click: () => handleMarkerClick(id) }}
              >
                <Popup><strong>{name}</strong></Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapView;
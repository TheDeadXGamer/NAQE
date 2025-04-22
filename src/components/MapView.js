import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {Badplatser} from './havApi';
import 'leaflet/dist/leaflet.css';

// configure default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const badplatser = new Badplatser();

const MapView = () => {
    const [beaches, setBeaches] = useState([]);
    const [selectedBeach, setSelectedBeach] = useState(null);

    useEffect(() => {
        // fetches all data
        const fetchData = async () => {
            const data = badplatser.getInstance();
            console.log('Fetched data:', data); // works fine
            setBeaches(data);
        };
        fetchData();
    }, []);

    return (
        <div className="map">
            <h1>Badplatser i Sverige</h1>
            <MapContainer
                center={[60.1282, 18.6435]}
                zoom={5}
                style={{ height: '600px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {Object.entries(beaches).map(([id, [name, municipality, samplingPointPosition]])  => {
                    if (!samplingPointPosition) return null;
                    console.log({ id, name, municipality, samplingPointPosition }); // Debugging log
                    console.log("hej");

                    return (
                        <Marker
                            key={id}
                            position={[samplingPointPosition.latitude, samplingPointPosition.longitude]}
                            eventHandlers={{
                                click: () => setSelectedBeach({ id, name, municipality, samplingPointPosition }),
                            }}
                        >
                            <Popup>{name}</Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {selectedBeach && (
                <div className="info-box">
                    <h2>{selectedBeach.bathingWater.name}</h2>
                    <p>{selectedBeach.bathingWater.description}</p>
                    <p>
                        <strong>Kommun:</strong>{' '}
                        {selectedBeach.bathingWater.municipality?.name}
                    </p>
                    <p>
                        <strong>Koordinater:</strong>{' '}
                        {selectedBeach.bathingWater.samplingPointPosition.latitude},{' '}
                        {selectedBeach.bathingWater.samplingPointPosition.longitude}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MapView;
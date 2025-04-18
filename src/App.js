import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {Badplatser} from './components/havApi.js';

function App() {
  const [dictionary, setDictionary] = useState(null); // State to store the dictionary
  const [badplats, setBadplats] = useState(null); // State to store the fetched badplats
  const badplatsId = 'SE0A21407000003882'; // Example ID for the badplats

  const [municipalityOptions, setMunicipalityOptions] = useState(null); // State to store municipality options
  const [selectedMunicipality, setSelectedMunicipality] = useState(null); // State for selected municipality
  const [municipalityBadplatser, setMunicipalityBadplatser] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      const badplatser = new Badplatser();
      await badplatser.initializeBadplatserInstance(); // Initialize the instance
      setDictionary(badplatser.getInstance()); // Fetch the dictionary

      const result = await badplatser.fetchBadplatsById(badplatsId); // Fetch the specific badplats
      setBadplats(result);

      const uniqueMunicipalities = new Set();
      [...badplatser.getInstance()].map(([id, [name, municipality]]) => uniqueMunicipalities.add(municipality));
      setMunicipalityOptions(uniqueMunicipalities)
    };

    fetchData(); // Call the function
  }, [badplatsId]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        
        <div id="searchContainer">
          <label htmlFor="municipality">Municipality:</label>
          <select
            name="municipality"
            id="municipality"
            onChange={async (e) => {
              const municipality = e.target.value;
              setSelectedMunicipality(municipality);

              const badplatser = new Badplatser();
              const badplatserList = await badplatser.fetchMunicipalityBathingWaters(municipality);
              setMunicipalityBadplatser(badplatserList);
            }}
          >
            {municipalityOptions ? (
              [...municipalityOptions].map((municipality) => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))
            ) : (
              <option value="">Loading...</option>
            )}
          </select>
        </div>

        <h2>Badplatser in {selectedMunicipality}</h2>
        {municipalityBadplatser.length > 0 ? (
          <ul>
            {municipalityBadplatser.map((badplats, index) => (
              <li key={index}>
                <strong>Name:</strong> {badplats.bathingWater.name} <br />
                <strong>Description:</strong> {badplats.bathingWater.description} <br />
                <strong>Coordinates:</strong> {badplats.bathingWater.samplingPointPosition.latitude}, {badplats.bathingWater.samplingPointPosition.longitude}
              </li>
            ))}
          </ul>
        ) : (
          <p>No badplatser available for this municipality.</p>
        )}
        <h1>HaV API Example</h1>
        <h2>Dictionary</h2>
        {dictionary ? (
          <ul>
            {[...dictionary.entries()].map(([id, [name, municipality]]) => (
              <li key={id}>
                <strong>ID: </strong>{id}, <strong>Name: </strong>{name}, <strong>Municipality: </strong>{municipality}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading dictionary...</p>
        )}
        <h2>Specific Badplats</h2>
        {badplats ? (
          <div>
            <h3>{badplats.bathingWater.name}</h3>
            <p>{badplats.bathingWater.description}</p>
            <p>
              <strong>Municipality:</strong> {badplats.bathingWater.municipality.name}
            </p>
            <p>
              <strong>Coordinates:</strong> {badplats.bathingWater.samplingPointPosition.latitude}, {badplats.bathingWater.samplingPointPosition.longitude}
            </p>
          </div>
        ) : (
          <p>Loading specific badplats...</p>
        )}
      </header>
    </div>
  );
}

export default App;

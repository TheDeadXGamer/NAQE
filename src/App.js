import React, { useState } from 'react';
import './App.css';
import Search from './components/Search';
import MapView from './components/MapView';
import {Badplatser} from './components/havApi.js';

function App() {
  const [currentView, setCurrentView] = useState('search');
  
  const [badplatserMap, setBadplatserMap] = useState(new Map()); // State to store badplatser Map
  const [municipalities, setMunicipalities] = useState([]); // State to store municipality names
  const [selectedMunicipality, setSelectedMunicipality] = useState(''); // State for selected municipality
  const [filteredBadplatser, setFilteredBadplatser] = useState([]); // State for filtered badplatser
  const [badplats, setBadplats] = useState(null); // State to store the fetched badplats
  const badplatsId = 'SE0A21407000003882'; // Example ID for the badplats
  const [selectedAbnormalSituations, setSelectedAbnormalSituations] = useState(''); // State for abnormal situations filter
  const [selectedAdviceAgainstBathing, setSelectedAdviceAgainstBathing] = useState(''); // State for advice against bathing filter
  
  const badplatser = new Badplatser();

  useEffect(() => {
    const fetchData = async () => {
      await badplatser.initializeBadplatserInstance(); // Initialize the instance
      setBadplatserMap(badplatser.getInstance()); 

      const result = await badplatser.fetchBadplatsById(badplatsId); // Fetch the specific badplats
      setBadplats(result);

      const municipalitiesData = badplatser.extractMunicipalities(badplatser.getInstance()); // Extract municipalities
      console.log('Municipalities:', municipalitiesData); // Debugging log
      setMunicipalities(municipalitiesData); // Store municipalities in state

      setFilteredBadplatser(Array.from(badplatser.getInstance().values())); // Initially show all badplatser

    };

    fetchData(); // Call the function
  }, []); // Only run once when the component mounts

  const handleMunicipalityChange = (e) => {
    const selected = e.target.value;
    setSelectedMunicipality(selected);

    // Filter badplatser by the selected municipality
    const filtered = badplatser.filterBadplatserByMunicipality(badplatser.getInstance(), selected);
    setFilteredBadplatser(filtered);
  };

  const handleAbnormalSituationsChange = (e) => {
    const selected = e.target.value;
    setSelectedAbnormalSituations(selected);
  };

  const handleAdviceAgainstBathingChange = (e) => {
    const selected = e.target.value;
    setSelectedAdviceAgainstBathing(selected);
  };

  const filterBadplatser = () => {
    let filtered = Array.from(badplatser.getInstance().values());

    // Filter by municipality
    if (selectedMunicipality) {
      filtered = badplatser.filterBadplatserByMunicipality(badplatserMap, selectedMunicipality);
    }

    // Filter by abnormal situations (Has / No abnormal situations)
    if (selectedAbnormalSituations) {
      if (selectedAbnormalSituations === 'has') {
        filtered = filtered.filter(badplats => badplats.abnormalSituations && badplats.abnormalSituations.length > 0);
      } else if (selectedAbnormalSituations === 'no') {
        filtered = filtered.filter(badplats => !badplats.abnormalSituations || badplats.abnormalSituations.length === 0);
      }
    }

    // Filter by advice against bathing (Has / No advice)
    if (selectedAdviceAgainstBathing) {
      if (selectedAdviceAgainstBathing === 'has') {
        filtered = filtered.filter(badplats => badplats.adviceAgainstBathing && badplats.adviceAgainstBathing.length > 0);
      } else if (selectedAdviceAgainstBathing === 'no') {
        filtered = filtered.filter(badplats => !badplats.adviceAgainstBathing || badplats.adviceAgainstBathing.length === 0);
      }
    }

    return filtered;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <nav>
        <button onClick={() => setCurrentView('search')}>Startsida</button>
        <button onClick={() => setCurrentView('map')}>Karta</button>
      </nav>
      <main>
        {currentView === 'search' && <Search />}
        {currentView === 'map' && <MapView />}
        {/* Dropdown Menu for Municipality Selection */}
        <h2>Municipality Selection</h2>
        <select
          value={selectedMunicipality}
          onChange={handleMunicipalityChange}
          disabled={municipalities.length === 0}
        >
          <option value="">All Municipalities</option>
          {municipalities.map((municipality, index) => (
            <option key={index} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
        <h2>State of Badplats</h2>
        <div className="filter-dropdowns">
          {/* Abnormal Situations Dropdown */}
          <select
            value={selectedAbnormalSituations}
            onChange={handleAbnormalSituationsChange}
            disabled={badplatserMap.size === 0}
          >
            <option value="">All Badplatser</option>
            <option value="has">Has Abnormal Situations</option>
            <option value="no">No Abnormal Situations</option>
          </select>

          {/* Advice Against Bathing Dropdown */}
          <select
            value={selectedAdviceAgainstBathing}
            onChange={handleAdviceAgainstBathingChange}
            disabled={badplatserMap.size === 0}
          >
            <option value="">All Badplatser</option>
            <option value="has">Has Advice Against Bathing</option>
            <option value="no">No Advice Against Bathing</option>
          </select>
        </div>

        {/* Display Filtered Badplatser */}
        <h2>Filtered Badplatser</h2>
        {filterBadplatser().length > 0 ? (
          <ul>
            {filterBadplatser().map((badplats, index) => {
              let displayText = badplats[0]

              // Display situation if applicable
              if (selectedAbnormalSituations === 'has' && badplats.abnormalSituations && badplats.abnormalSituations.length > 0) {
                displayText += `, Situation: ${badplats.abnormalSituations.join(', ')}`;
              } else if (selectedAbnormalSituations === 'no' && (!badplats.abnormalSituations || badplats.abnormalSituations.length === 0)) {
                displayText += ', No abnormal situations';
              }

              // Display advice if applicable
              if (selectedAdviceAgainstBathing === 'has' && badplats.adviceAgainstBathing && badplats.adviceAgainstBathing.length > 0) {
                displayText += `, Advice: ${badplats.adviceAgainstBathing.join(', ')}`;
              } else if (selectedAdviceAgainstBathing === 'no' && (!badplats.adviceAgainstBathing || badplats.adviceAgainstBathing.length === 0)) {
                displayText += ', No advice against bathing';
              }

              return (
                <li key={index}>
                  <strong>{displayText}</strong>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No badplatser available with the selected filters.</p>
        )}
      </main>
    </div>
  );
}

export default App;
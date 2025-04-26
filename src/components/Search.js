import React, {useEffect, useState} from 'react';
import logo from '../logo.svg'; // justera vägen om din logga ligger annorlunda
import '../App.css';
import { Badplatser } from './havApi';
import { useFavorites } from '../context/FavouritesContext'; 

const Search = () => {

    const [badplatserMap, setBadplatserMap] = useState(new Map()); // State to store badplatser Map
    const [municipalities, setMunicipalities] = useState([]); // State to store municipality names
    const [selectedMunicipality, setSelectedMunicipality] = useState(''); // State for selected municipality
    const [filteredBadplatser, setFilteredBadplatser] = useState([]); // State for filtered badplatser
    const [badplats, setBadplats] = useState(null); // State to store the fetched badplats
    const badplatsId = 'SE0A21407000003882'; // Example ID for the badplats
    const [selectedAbnormalSituations, setSelectedAbnormalSituations] = useState(''); // State for abnormal situations filter
    const [selectedAdviceAgainstBathing, setSelectedAdviceAgainstBathing] = useState(''); // State for advice against bathing filter
    
    const { favorites, addFavorite, removeFavorite } = useFavorites();

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

      const isFavorite = (id) => favorites.some((item) => item.id === id);

    return (
        <div className="search">
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
                const id = badplats[0];
                const name = badplats[0];
                const municipality = badplats[1];
                const position = badplats[2];
                
                let displayText = name

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
                    <button
                      className="search-favorites-button"
                      onClick={() =>
                          isFavorite(id)
                              ? removeFavorite(id)
                              : addFavorite({ id, name, municipality, position })
                      }
                    >
                        {isFavorite(id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    </li>
                );
                })}
            </ul>
            ) : (
            <p>No badplatser available with the selected filters.</p>
            )}
        </div>
    );
};

export default Search;
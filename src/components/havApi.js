// havApi.js

export const fetchAllBadplatser = async () => {
  try {
    const response = await fetch('https://gw-test.havochvatten.se/external-public/bathing-waters/v2/bathing-waters');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await response.json();

    // Create a Map with id as the key and bathingWater object as the value
    const dictionary = new Map();
    (result.watersAndAdvisories || []).forEach((item) => {
      dictionary.set(item.bathingWater.id, item.bathingWater);
    });

    return dictionary; // Return the Map
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Map(); // Return an empty Map if an error occurs
  }
};

export const fetchBadplatsById = async (id) => {
  try {
    const response = await fetch(`https://gw-test.havochvatten.se/external-public/bathing-waters/v2/bathing-waters/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch badplats with ID: ${id}`);
    }
    const result = await response.json();
    return result; // Return the specific badplats data
  } catch (error) {
    console.error('Error fetching specific badplats:', error);
    return null; // Return null if an error occurs
  }
};

export const extractMunicipalities = (badplatserMap) => {
  const municipalitiesSet = new Set();

  // Iterate through the Map and extract municipality names
  badplatserMap.forEach((badplats) => {
    if (badplats.municipality) {
      municipalitiesSet.add(badplats.municipality.name);
    }
  });

  return Array.from(municipalitiesSet).sort(); // Return sorted array of municipalities
};

export const filterBadplatserByMunicipality = (badplatserMap, municipality) => {
  if (!municipality) return Array.from(badplatserMap.values()); // If no municipality is selected, return all badplatser

  // Filter badplatser by the selected municipality
  return Array.from(badplatserMap.values()).filter(
    (item) => item.municipality && item.municipality.name === municipality
  );
};

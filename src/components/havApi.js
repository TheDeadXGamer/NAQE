
//
export const fetchAllBadplatser = async () => {
  try {
    const response = await fetch('https://gw-test.havochvatten.se/external-public/bathing-waters/v2/bathing-waters');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await response.json();

    // Create a dictionary with id as the key and name as the value
    const dictionary = new Map();
    (result.watersAndAdvisories || []).slice(0, 5).forEach((item) => {
      dictionary.set(item.bathingWater.id, item.bathingWater.name);
    });

    return dictionary; // Return the dictionary
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null if an error occurs
  }
};

// Function to fetch a specific badplats by ID
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
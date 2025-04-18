let instance = new Map(); // Initialize the instance variable

export class Badplatser {
  constructor() {
    if (!instance) {
      instance = this.initializeBadplatserInstance();
    }
  }
  async initializeBadplatserInstance() {
    try {
      const response = await fetch('https://gw-test.havochvatten.se/external-public/bathing-waters/v2/bathing-waters');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();

      // Create a dictionary with id as the key and name as the value
      const dictionary = new Map();
      (result.watersAndAdvisories || []).slice(0, 5).forEach((item) => {
        dictionary.set(item.bathingWater.id, [item.bathingWater.name, item.bathingWater.municipality.name]);
      });

      instance = dictionary; // Cache the dictionary
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  getInstance() {
    return instance; // Return the cached instance
  }

  updateInstance() {
    instance = null;
    instance = this.initializeBadplatserInstance(); // Update the cached instance
  }

  // Function to fetch a specific badplats by ID
  async fetchBadplatsById (id) {
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

  async fetchMunicipalityBathingWaters(wantedMunicipality) {
    const bathingWaters = [];
    if (!instance) {
      console.error('Instance is not initialized.');
      return bathingWaters; // Return an empty array if instance is not initialized
    }

    for (const [id, [name, municipality]] of instance.entries()) {
      if (municipality === wantedMunicipality) {
        try {
          const response = await fetch(`https://gw-test.havochvatten.se/external-public/bathing-waters/v2/bathing-waters/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch bathing water with ID: ${id}`);
          }
          const result = await response.json();
          bathingWaters.push(result); // Add the bathing water data to the array
        } catch (error) {
          console.error(`Error fetching bathing water with ID ${id}:`, error);
        }
      }
    }

    return bathingWaters; // Return the array of bathing waters for the specific municipality
  };
}


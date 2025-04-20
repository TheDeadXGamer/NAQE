// havApi.js
export const fetchAllBadplatser = async () => {
  try {
    const response = await fetch(
        'https://gw-test.havochvatten.se/external-public/bathing-waters/v2/bathing-waters'
    );
    if (!response.ok) throw new Error('Failed to fetch data');
    const result = await response.json();
    return (result.watersAndAdvisories || []).slice(0, 100); // Ta första 100
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const fetchBadplatsById = async (id) => {
  try {
    const response = await fetch(
        `https://gw-test.havochvatten.se/external-public/bathing-waters/v2/bathing-waters/${id}`
    );
    if (!response.ok) throw new Error(`Failed to fetch badplats with ID: ${id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching specific badplats:', error);
    return null;
  }
};
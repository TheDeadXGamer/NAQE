import React from 'react';
import { render, act } from '@testing-library/react';
import { RecentPlacesProvider, useRecentPlaces } from '../context/RecentPlacesContext';

// Test component to interact with the context
const TestComponent = () => {
  const { recentPlaces, addRecentPlace } = useRecentPlaces();

  return (
    <div>
      <ul>
        {recentPlaces.map((place) => (
          <li key={place.id}>
            {place.name} - {place.municipality}
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          addRecentPlace({
            id: '1',
            name: 'Test Place',
            municipality: 'Test Municipality',
            position: { latitude: 59.3293, longitude: 18.0686 },
            stats: {
              takenAt: '2025-05-10T00:00:00Z',
              waterTemp: 20,
              escherichiaColiPrefix: '<',
              escherichiaColiCount: 10,
              escherichiaColiAssessIdText: 'Good',
              intestinalEnterococciPrefix: '<',
              intestinalEnterococciCount: 5,
              intestinalEnterococciAssessIdText: 'Excellent',
              sampleAssessIdText: 'Safe',
              pollutionTypeIdText: 'None',
            },
          })
        }
      >
        Add Recent Place
      </button>
    </div>
  );
};

describe('RecentPlacesContext', () => {
  it('should add a recently viewed place', () => {
    const { getByText, queryByText } = render(
      <RecentPlacesProvider>
        <TestComponent />
      </RecentPlacesProvider>
    );

    // Initially, no places should be displayed
    expect(queryByText('Test Place - Test Municipality')).toBeNull();

    // Add a recent place
    act(() => {
      getByText('Add Recent Place').click();
    });

    // Verify that the recently viewed place is displayed
    expect(getByText('Test Place - Test Municipality')).toBeInTheDocument();
  });

  it('should not add duplicate recently viewed places', () => {
    const { getByText, getAllByText } = render(
      <RecentPlacesProvider>
        <TestComponent />
      </RecentPlacesProvider>
    );

    // Add the same place twice
    act(() => {
      getByText('Add Recent Place').click();
      getByText('Add Recent Place').click();
    });

    // Verify that the place is only added once
    expect(getAllByText('Test Place - Test Municipality').length).toBe(1);
  });
});
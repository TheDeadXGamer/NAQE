import React from 'react';
import { render, act } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../context/FavouritesContext';

// Test component to interact with the context
const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  return (
    <div>
      <ul>
        {favorites.map((fav) => (
          <li key={fav.id}>
            {fav.name}
            <button onClick={() => removeFavorite(fav.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          addFavorite({ id: '1', name: 'Test Place', municipality: 'Test Municipality' })
        }
      >
        Add Favorite
      </button>
    </div>
  );
};

describe('FavouritesContext', () => {
  it('should add a favorite', () => {
    const { getByText, queryByText } = render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(queryByText('Test Place')).toBeNull();

    act(() => {
      getByText('Add Favorite').click();
    });

    expect(getByText('Test Place')).toBeInTheDocument();
  });

  it('should remove a favorite', () => {
    const { getByText, queryByText } = render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    act(() => {
      getByText('Add Favorite').click();
    });

    expect(getByText('Test Place')).toBeInTheDocument();

    act(() => {
      getByText('Remove').click();
    });

    expect(queryByText('Test Place')).toBeNull();
  });

  it('should not add duplicate favorites', () => {
    const { getByText, getAllByText } = render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    act(() => {
      getByText('Add Favorite').click();
      getByText('Add Favorite').click();
    });

    expect(getAllByText('Test Place').length).toBe(1);
  });
});
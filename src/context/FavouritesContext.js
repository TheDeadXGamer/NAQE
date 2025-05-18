import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

let favoritesRef = null; // Reference to the current favorites state
let addFavoriteRef = null; // Reference to the addFavorite function
let removeFavoriteRef = null; // Reference to the removeFavorite function

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  favoritesRef = favorites; // Update the reference to the current favorites state

  const addFavorite = (item) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === item.id)) return prev; // Avoid duplicates
      return [...prev, item];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  addFavoriteRef = addFavorite; // Update the reference to the addFavorite function
  removeFavoriteRef = removeFavorite; // Update the reference to the removeFavorite function

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook for components that need to use the context
export const useFavorites = () => useContext(FavoritesContext);

// Utility functions to access favorites without using hooks
export const getFavorites = () => favoritesRef;
export const addFavorite = (item) => addFavoriteRef && addFavoriteRef(item);
export const removeFavorite = (id) => removeFavoriteRef && removeFavoriteRef(id);
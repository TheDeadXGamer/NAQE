import React, { createContext, useState, useContext } from 'react';

const RecentPlacesContext = createContext();

export const RecentPlacesProvider = ({ children }) => {
  const [recentPlaces, setRecentPlaces] = useState([]);

  const addRecentPlace = (place) => {
    setRecentPlaces((prev) => {
      // Avoid duplicates
      if (prev.some((recent) => recent.id === place.id)) return prev;
      return [...prev, place];
    });
  };

  return (
    <RecentPlacesContext.Provider value={{ recentPlaces, addRecentPlace }}>
      {children}
    </RecentPlacesContext.Provider>
  );
};

export const useRecentPlaces = () => useContext(RecentPlacesContext);
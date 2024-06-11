import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export function StoreProvider ({ children }) {
  const [store, setStore] = useState({});

  useEffect(() => {
    const savedStore = localStorage.getItem('store');
    if (savedStore) {
      setStore(JSON.parse(savedStore));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('store', JSON.stringify(store));
  }, [store]);
  console.log(store);

  const resetStore = () => {
    setStore({});
    localStorage.removeItem('store');
  };

  return (
    <StoreContext.Provider value={{ store, setStore, resetStore }}>
      {children}
    </StoreContext.Provider>
  );
}

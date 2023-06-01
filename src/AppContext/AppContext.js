import { createContext, useContext, useReducer } from "react";

export const AppContextData = createContext();

export const AppContext = ({ initial, reducer, children }) => (
  <AppContextData.Provider value={useReducer(reducer, initial)}>
    {children}
  </AppContextData.Provider>
);

export const useAppData = () => useContext(AppContextData);

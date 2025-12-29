"use client";

import { createContext, useContext, useState } from "react";

//Create Context

const GlobalContext = createContext();

///Create Provider

export const GlobalProvider = ({ children }) => {
  const [unReadCount, setUnReadCount] = useState(0);

  return (
    <GlobalContext.Provider value={{ unReadCount, setUnReadCount }}>
      {children}
    </GlobalContext.Provider>
  );
};

//Create a custom hook to use the GlobalContext

export function useGlobalContext() {
  return useContext(GlobalContext);
}

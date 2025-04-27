
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IndiaModeContextType {
  indiaMode: boolean;
  toggleIndiaMode: () => void;
}

const IndiaModeContext = createContext<IndiaModeContextType | undefined>(undefined);

export const IndiaModeProvider = ({ children }: { children: ReactNode }) => {
  const [indiaMode, setIndiaMode] = useState(false);

  const toggleIndiaMode = () => {
    setIndiaMode((prev) => !prev);
  };

  return (
    <IndiaModeContext.Provider value={{ indiaMode, toggleIndiaMode }}>
      {children}
    </IndiaModeContext.Provider>
  );
};

export const useIndiaMode = () => {
  const context = useContext(IndiaModeContext);
  if (context === undefined) {
    throw new Error('useIndiaMode must be used within an IndiaModeProvider');
  }
  return context;
};

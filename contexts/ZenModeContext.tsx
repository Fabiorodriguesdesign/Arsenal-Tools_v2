
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ZenModeContextType {
  isZenMode: boolean;
  toggleZenMode: () => void;
  enableZenMode: () => void;
  disableZenMode: () => void;
}

const ZenModeContext = createContext<ZenModeContextType | undefined>(undefined);

export const ZenModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isZenMode, setIsZenMode] = useState(false);

  const toggleZenMode = useCallback(() => setIsZenMode(prev => !prev), []);
  const enableZenMode = useCallback(() => setIsZenMode(true), []);
  const disableZenMode = useCallback(() => setIsZenMode(false), []);

  return (
    <ZenModeContext.Provider value={{ isZenMode, toggleZenMode, enableZenMode, disableZenMode }}>
      {children}
    </ZenModeContext.Provider>
  );
};

export const useZenMode = () => {
  const context = useContext(ZenModeContext);
  if (context === undefined) {
    throw new Error('useZenMode must be used within a ZenModeProvider');
  }
  return context;
};

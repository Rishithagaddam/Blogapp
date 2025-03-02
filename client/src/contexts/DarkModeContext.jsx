import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check local storage for saved preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Default to dark mode
  });

  useEffect(() => {
    // Save preference to local storage
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return [context.isDark, context.toggleDarkMode];
}
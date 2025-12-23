import React, { createContext, useEffect, useState } from "react";
import { getFromStorage,saveToStorage } from "../utils/storage";


export const ThemeContext=createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => getFromStorage("theme", "dark")
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    saveToStorage("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export default ThemeProvider;


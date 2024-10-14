import { useState, useEffect } from "react";

type TTheme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<TTheme>("light");

  useEffect(() => {
    // Get the stored theme from localStorage, defaulting to "light"
    const storedTheme = (localStorage.getItem("theme") as TTheme) || "light";
    setTheme(storedTheme);
    
    // Function to handle theme change based on the document's class list
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme); // Store the theme in localStorage
    };

    // Initialize the theme based on the class list
    handleThemeChange();

    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup function to disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  return theme;
};

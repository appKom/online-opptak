import { useState, useEffect } from "react";
import { MoonIcon as MoonIconSolid } from "@heroicons/react/24/solid";
import { MoonIcon as MoonIconOutline } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = window.localStorage.getItem("theme");
      return storedTheme ? storedTheme : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <button className="group" onClick={toggleTheme}>
      {theme === "dark" ? (
        <MoonIconSolid className="h-10 w-10 text-white group-hover:fill-current" />
      ) : (
        <MoonIconOutline className="h-10 w-10 text-black group-hover:fill-current" />
      )}
    </button>
  );
};

export default ThemeToggle;

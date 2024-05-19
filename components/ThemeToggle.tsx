import { useState, useEffect } from "react";
import { MoonIcon as MoonIconSolid } from "@heroicons/react/24/solid";
import { SunIcon as SunIconSolid } from "@heroicons/react/24/solid";

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
    root.classList.toggle("dark", theme === "dark");

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div>
      <div className="hidden md:block">
        <button
          className="p-2 transition duration-300 ease-in-out rounded-full group"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <MoonIconSolid className="w-6 h-6 transition-transform duration-300 ease-in-out text-online-orange group-hover:scale-110" />
          ) : (
            <SunIconSolid className="w-6 h-6 transition-transform duration-300 ease-in-out text-online-orange group-hover:scale-110" />
          )}
        </button>
      </div>
      <div className="md:hidden">
        <button
          className="block p-2 px-4 py-2 text-sm text-gray-700 transition duration-300 ease-in-out rounded-full cursor-pointer group dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <p>Lightmode</p> : <p>Darkmode</p>}
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;

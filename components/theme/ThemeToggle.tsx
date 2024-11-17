import {
  MoonIcon as MoonIconSolid,
  SunIcon as SunIconSolid,
} from "@heroicons/react/24/solid";
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <div className="hidden md:block">
        <button
          className="p-2 transition duration-300 ease-in-out rounded-full group"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
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
          className="w-full p-2 px-4 py-2 text-left text-gray-700 cursor-pointer group dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <p>Lightmode</p> : <p>Darkmode</p>}
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;

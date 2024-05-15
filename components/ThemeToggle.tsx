import { useTheme } from "../styles/darkmode/theme-context";
import { MoonIcon as MoonIconSolid } from "@heroicons/react/24/solid";
import { MoonIcon as MoonIconOutline } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

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

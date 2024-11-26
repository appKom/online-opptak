import React, { useEffect, useRef } from "react";
import ThemeToggle from "./theme/ThemeToggle";
import Link from "next/link";

interface User {
  name: string;
  role?: string;
  isCommittee?: boolean;
}

interface Session {
  user?: User;
}

type Props = {
  session: Session | null;
  handleLogin: () => void;
  handleLogout: () => void;
  toggleDropdown: () => void;
};

const DropdownMenu = ({
  session,
  handleLogin,
  handleLogout,
  toggleDropdown,
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const RenderLink = ({ path, label }: { path: string; label: string }) => (
    <Link href={path} passHref>
      <button
        onClick={toggleDropdown}
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
      >
        {label}
      </button>
    </Link>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      className="absolute right-0 z-10 min-w-48 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xl cursor-pointer dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      ref={menuRef}
    >
      {!session?.user ? (
        <>
          <button
            onClick={handleLogin}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            Logg inn
          </button>
          <ThemeToggle />
        </>
      ) : (
        <>
          <div className="px-4 pb-2 pt-1 cursor-default border-b">
            <div>Logget inn som</div>
            <b>{session?.user.name}</b>
          </div>
          <RenderLink path="/" label="Hjem" />
          {session?.user.role === "admin" && (
            <RenderLink path="/admin" label="Admin" />
          )}
          {session?.user.isCommittee && (
            <RenderLink path="/committee" label="For komiteer" />
          )}
          <ThemeToggle />
          <button
            onClick={() => {
              handleLogout();
              toggleDropdown();
            }}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            Logg ut
          </button>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;

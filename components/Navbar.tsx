import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import LoginIcon from "./icons/icons/LogInIcon";
import LogOutIcon from "./icons/icons/LogOutIcon";
import AdminIcon from "./icons/icons/AdminIcon";
import Button from "./Button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Make sure you have the XMarkIcon
import ThemeToggle from "./ThemeToggle";
import CommitteeIcon from "./icons/icons/CommitteeIcon";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);

    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    handleThemeChange(); // Check the initial theme

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLogout = () => {
    signOut();
  };

  const handleLogin = () => {
    signIn("auth0");
  };

  const isLinkActive = (uri: string) => {
    return router.pathname === uri;
  };

  return (
    <div>
      <div className="hidden md:flex justify-between w-full px-5 py-5 sm:items-center border-b-[1px] border-gray-200 dark:border-gray-600">
        <Link href="/" passHref>
          <a
            className={isLinkActive("/") ? "active" : ""}
            aria-label="Online logo"
          >
            <Image
              src={theme === "dark" ? "/Online_hvit.svg" : "/Online_bla.svg"}
              width={100 * 1.5}
              height={30 * 1.5}
              alt="Online logo"
              className="transition-all cursor-pointer hover:opacity-60"
            />
          </a>
        </Link>

        {!session ? (
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal dark:text-white">
            <ThemeToggle />
            <Button
              title="Logg inn"
              color="blue"
              size="small"
              icon={<LoginIcon className="w-4 h-4" />}
              onClick={handleLogin}
            />

            <Image
              onClick={() => router.push("https://www.bekk.no/")}
              src={theme === "dark" ? "/bekk_white.svg" : "/bekk_black.svg"}
              width={100}
              height={30 * 1.5}
              alt="Online logo"
              className="transition-all cursor-pointer hover:opacity-60"
            />
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal dark:text-white">
            <div className="text-right">
              Logget inn som{" "}
              <span className="font-medium">{session.user?.name}</span>
            </div>
            {session.user?.role === "admin" && (
              <Button
                title="Admin"
                color="orange"
                size="small"
                icon={<AdminIcon className="w-4 h-4" fill={""} />}
                onClick={() => router.push("/admin")}
              />
            )}
            {session.user?.isCommitee && (
              <Button
                title="For komiteer"
                color="blue"
                size="small"
                icon={<CommitteeIcon fill="" className="w-4 h-4" />}
                onClick={() => router.push("/committee")}
              />
            )}
            <Button
              title="Logg ut"
              color="white"
              size="small"
              icon={<LogOutIcon className="w-4 h-4" />}
              onClick={handleLogout}
            />
            <ThemeToggle />
            <Image
              onClick={() => router.push("https://www.bekk.no/")}
              src={theme === "dark" ? "/bekk_white.svg" : "/bekk_black.svg"}
              width={100}
              height={30 * 1.5}
              alt="Online logo"
              className="transition-all cursor-pointer hover:opacity-60"
            />
          </div>
        )}
      </div>
      <div className="relative md:hidden flex justify-between items-center px-5 py-5 border-b-[1px] border-gray-200 dark:border-gray-600">
        <Image
          onClick={() => router.push("/")}
          src={theme === "dark" ? "/Online_hvit_o.svg" : "/Online_bla_o.svg"}
          width={60}
          height={30 * 1.5}
          alt="Online logo"
          className="transition-all cursor-pointer hover:opacity-60"
        />

        <Image
          onClick={() => router.push("https://www.bekk.no/")}
          src={theme === "dark" ? "/bekk_white.svg" : "/bekk_black.svg"}
          width={100}
          height={30 * 1.5}
          alt="Online logo"
          className="transition-all cursor-pointer hover:opacity-60"
        />
        <div className="relative">
          <button onClick={toggleDropdown} className="flex justify-end">
            {isDropdownOpen ? (
              <XMarkIcon className="h-10 w-10 text-gray-500 dark:text-white transition-transform transform rotate-45" />
            ) : (
              <Bars3Icon className="h-10 w-10 text-gray-500 dark:text-white transition-transform transform" />
            )}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 rounded-lg shadow-xl bg-white dark:bg-online-darkBlue border-t border-gray-200 dark:border-gray-600">
              {!session ? (
                <div>
                  <ThemeToggle />
                  <a
                    onClick={handleLogin}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logg inn
                  </a>
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-white">
                    Logget inn som{" "}
                    <span className="font-medium">{session.user?.name}</span>
                  </div>
                  {session.user?.role === "admin" && (
                    <a
                      onClick={() => {
                        router.push("/admin");
                        toggleDropdown();
                      }}
                      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Admin
                    </a>
                  )}

                  {session.user?.isCommitee && (
                    <a
                      onClick={() => {
                        router.push("/committee");
                        toggleDropdown();
                      }}
                      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      For komiteer
                    </a>
                  )}
                  <ThemeToggle />
                  <a
                    onClick={() => {
                      handleLogout();
                      toggleDropdown();
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logg ut
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

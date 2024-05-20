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
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import DropdownMenu from "./DropdownMenu";

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
      <div className="hidden md:flex justify-between w-full px-5 py-5 sm:items-center border-b-[1px] border-gray-200 dark:border-0 dark:bg-gray-800">
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
          alt="Bekk logo"
          className="transition-all cursor-pointer hover:opacity-60"
        />
        <div className="relative">
          <button onClick={toggleDropdown} className="flex justify-end">
            {isDropdownOpen ? (
              <XMarkIcon className="w-10 h-10 text-gray-500 transition-transform transform rotate-45 dark:text-white" />
            ) : (
              <Bars3Icon className="w-10 h-10 text-gray-500 transition-transform transform dark:text-white" />
            )}
          </button>
          {isDropdownOpen && (
            <DropdownMenu
              session={session}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              router={router}
              toggleDropdown={toggleDropdown}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

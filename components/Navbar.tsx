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
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");

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
    <div className="flex justify-between w-full px-5 py-5 sm:items-center border-b-[1px] border-gray-200 dark:border-gray-600">
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
        <Button
          title="Logg inn"
          color="blue"
          size="small"
          icon={<LoginIcon className="w-4 h-4" />}
          onClick={handleLogin}
        />
      ) : (
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal dark:text-white">
          <div className="text-right">
            Logget inn som{" "}
            <span className="font-medium">{session.user?.name}</span>
          </div>
          {session.user?.role === "admin" && (
            <Button
              title="Admin"
              color="blue"
              size="small"
              icon={<AdminIcon className="w-4 h-4" fill={""} />}
              onClick={() => router.push("/admin")}
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
        </div>
      )}
    </div>
  );
};

export default Navbar;

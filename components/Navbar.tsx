import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import LoginIcon from "./icons/icons/LogInIcon";
import LogOutIcon from "./icons/icons/LogOutIcon";
import Button from "./Button";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

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
    <div className="flex justify-between w-full px-5 py-5 text--online-white sm:items-center border-b-[1px] border-gray-200">
      <Link href="/" passHref>
        <a
          className={isLinkActive("/") ? "active" : ""}
          aria-label="Online logo"
        >
          <Image
            src="/Online_bla.svg"
            width={100}
            height={30}
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
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal">
          <div className="text-right">
            Logget inn som{" "}
            <span className="font-medium">{session.user?.name}</span>
          </div>
          <Button
            title="Logg ut"
            color="white"
            size="small"
            icon={<LogOutIcon className="w-4 h-4" />}
            onClick={handleLogout}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;

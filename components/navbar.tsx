import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import LoginIcon from "./icons/login";
import LogoutIcon from "./icons/logout";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut();
  };

  const handleLogin = () => {
    signIn("ow4");
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
            className="cursor-pointer"
          />
        </a>
      </Link>

      {!session ? (
        <button
          type="button"
          onClick={handleLogin}
          className="rounded-lg bg-online-darkTeal inline-flex items-center gap-1.5 px-5 py-2.5 text-center text-sm font-medium text-online-white shadow-sm transition-all hover:text-online-orange focus:ring focus:ring-gray-100"
        >
          Logg inn
          <LoginIcon />
        </button>
      ) : (
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal">
          <div className="text-right">
            Logget inn som{" "}
            <span className="font-medium">{session.user?.name}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border inline-flex items-center gap-1.5  hover:border-online-orange bg-online-white px-5 py-2.5 text-center text-sm font-medium text-online-darkTeal shadow-sm transition-all  hover:text-online-orange focus:ring focus:ring-gray-100"
          >
            Logg ut
            <LogoutIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

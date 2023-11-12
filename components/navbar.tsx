import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../lib/hooks/useAuth";

const navElements = [
  {
    title: "Søknad",
    uri: "/form",
  },
  {
    title: "For komiteer",
    uri: "/committee",
  },
];

const Navbar = () => {
  const router = useRouter();
  const { profile, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
  };

  const handleLogin = () => {
    router.push(
      `https://old.online.ntnu.no/openid/authorize?` +
        `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}` +
        `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}` +
        `&response_type=code` +
        `&scope=openid+profile+onlineweb4`
    );
  };

  const isLinkActive = (uri: string) => {
    return router.pathname === uri;
  };

  const link_styling =
    "text-online-white hover:text-online-orange transition-all cursor-pointer";

  return (
    <div className="w-full text--online-white bg-online-darkTeal flex justify-between items-center pl-3 pr-10 py-3">
      <Link href="/" passHref>
        <a
          className={isLinkActive("/") ? "active" : ""}
          aria-label="Online logo"
        >
          <Image
            src="/Online_hvit.svg"
            width={100}
            height={30}
            alt="Online logo"
            className="cursor-pointer"
          />
        </a>
      </Link>

      <div className="flex gap-10 lg:gap-20">
        {navElements.map((element) => (
          <Link key={element.uri} href={element.uri}>
            <a
              className={
                link_styling +
                (isLinkActive(element.uri) &&
                  " text-online-orange font-semibold")
              }
            >
              {element.title}
            </a>
          </Link>
        ))}
      </div>
      {!profile ? (
        <div onClick={handleLogin}>
          <p className={link_styling}>Logg inn</p>
        </div>
      ) : (
        <div onClick={handleLogout}>
          <p className={link_styling}>Logg ut</p>
        </div>
      )}
    </div>
  );
};

export default Navbar;

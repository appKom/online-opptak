import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, fetchProfile } from "../lib/redux/profileSlice";
import Cookies from "js-cookie";

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
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.data);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(clearProfile());
  };

  console.log(process.env.NEXT_PUBLIC_REDIRECT_URI);

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
                "text-online-white hover:text-online-orange transition-all" +
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
          <p className="text-online-white hover:text-online-orange transition-all cursor-pointer">
            Logg inn
          </p>
        </div>
      ) : (
        <div onClick={handleLogout}>
          <p className="text-online-white hover:text-online-orange transition-all cursor-pointer">
            Logg ut
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;

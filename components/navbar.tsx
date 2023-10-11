import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const navElements = [
  {
    title: "For søkere",
    uri: "/form",
  },
  {
    title: "For komiteer",
    uri: "/committee",
  },
  {
    title: "Oversikt",
    uri: "/applicantoverview",
  },
];

const Navbar = () => {
  const router = useRouter();

  const isLinkActive = (uri: string) => {
    return router.pathname === uri;
  };

  return (
    <div className="w-full text--online-white bg-online-darkTeal flex justify-between items-center px-10 py-2">
      <Link href="/" passHref>
        <a className={isLinkActive("/") ? "active" : ""}>
          <Image
            src="/Online_hvit.svg"
            width={190}
            height={50}
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
                (isLinkActive(element.uri)
                  ? " text-online-orange font-semibold"
                  : "")
              }
            >
              {element.title}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;

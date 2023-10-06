import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";

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
  const isLinkActive = (href: string) => router.pathname === href;

  return (
    <div className="w-full text-white bg-online-darkTeal flex justify-between items-center px-10 py-5">
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
            <a className={isLinkActive(element.uri) ? "underline" : ""}>
              {element.title}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;

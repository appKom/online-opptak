import {
  Slack,
  Facebook,
  Instagram,
  Github,
  Mail,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "../lib/hooks/useTheme";

const footerLinks = [
  { name: "Slack", icon: <Slack />, link: "https://onlinentnu.slack.com/" },
  {
    name: "Facebook",
    icon: <Facebook />,
    link: "http://facebook.com/LinjeforeningenOnline",
  },
  {
    name: "Instagram",
    icon: <Instagram />,
    link: "https://www.instagram.com/online_ntnu/",
  },
  { name: "Github", icon: <Github />, link: "https://github.com/appKom" },
];

export default function Footer() {
  const theme = useTheme();

  return (
    <footer className="px-4 py-12 mt-24 text-gray-700 bg-white border-t border-gray-300 dark:text-gray-300 dark:border-gray-700 md:px-6 lg:px-8 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between mb-8 space-y-8 md:flex-row md:space-y-0">
          <div className="flex flex-col items-center space-y-4 md:items-start">
            <h2 className="text-2xl font-bold">Online Opptak</h2>
            <Link href="mailto:onlinefondet@online.ntnu.no" passHref>
              <a className="flex items-center gap-2 transition-colors cursor-pointer hover:text-online-orange">
                <Mail size={18} />
                appkom@online.ntnu.no
              </a>
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-4 md:items-end">
            <div className="flex space-x-4">
              {footerLinks.map((link, index) => (
                <Link href={link.link} key={index} passHref>
                  <a
                    className="transition cursor-pointer hover:text-online-orange"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                </Link>
              ))}
            </div>
            <div className="text-sm text-center md:text-right">
              <p>Skjedd en feil?</p>
              <Link
                href="mailto:appkom@online.ntnu.no"
                className="flex items-center justify-center md:justify-end"
                passHref
              >
                <a className="flex items-center space-x-1 transition hover:text-online-orange hover:underline">
                  <span>Ta kontakt med Appkom</span>
                  <ExternalLink size={14} />
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between py-8 space-y-6 border-t border-gray-300 dark:border-gray-700 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-6">
            <Link href="https://online.ntnu.no/" target="_blank">
              <a className="transition hover:opacity-50">
                <Image
                  src={theme === "dark" ? "/Online_hvit.svg" : "/Online_bla.svg"}
                  alt="Online logo"
                  width={128}
                  height={34}
                />
              </a>
            </Link>
            <Link href="https://www.bekk.no/" target="_blank">
              <a className="transition hover:opacity-50">
                <Image
                  src={theme === "dark" ? "/bekk_white.svg" : "/bekk_black.svg"}
                  alt="Online logo"
                  width={128}
                  height={57}
                />
              </a>
            </Link>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Online Opptak. Alle rettigheter
            reservert.
          </p>
        </div>
      </div>
    </footer>
  );
}

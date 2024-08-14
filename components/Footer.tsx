import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full py-5 px-5 flex flex-col items-center gap-3 text-online-darkTeal dark:text-white">
      <div>
        Skjedd en feil? Ta kontakt med{" "}
        <Link
          className="font-semibold underline transition-all hover:text-online-orange"
          href="mailto:appkom@online.ntnu.no"
        >
          Appkom
        </Link>{" "}
        :)
      </div>
    </div>
  );
};

export default Footer;

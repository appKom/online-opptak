const Footer = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 py-5">
      <div className="flex flex-col items-center gap-3 text-online-darkTeal dark:text-white">
        <div>
          Skjedd en feil? Ta kontakt med{" "}
          <a
            className="font-semibold underline transition-all hover:text-online-orange"
            href="mailto:appkom@online.ntnu.no"
          >
            Appkom
          </a>{" "}
          :)
        </div>
      </div>
    </div>
  );
};

export default Footer;

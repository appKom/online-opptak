const Footer = () => {
  return (
    <div className="flex flex-col items-center gap-3 my-5 text-online-darkTeal">
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
  );
};

export default Footer;

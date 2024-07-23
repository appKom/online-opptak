import Image from "next/image";
import { useTheme } from "../lib/hooks/useTheme";

const ErrorPage = () => {
  const theme = useTheme();

  const onlineLogoSrc =
    theme === "dark" ? "/Online_hvit.svg" : "/Online_bla.svg";

  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 bg-white dark:bg-gray-900">
      <Image
        src={onlineLogoSrc}
        width={300}
        height={100}
        alt="Online logo"
      />
      <div className="text-xl text-black dark:text-white">Det har skjedd en feil :(</div>
    </div>
  );
};

export default ErrorPage;

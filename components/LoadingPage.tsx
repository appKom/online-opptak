import Image from "next/image";
import { useTheme } from "../lib/hooks/useTheme";

const LoadingPage = () => {
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
        className="animate-pulse"
      />
      <div className="text-xl text-black dark:text-white">Vent litt...</div>
    </div>
  );
};

export default LoadingPage;

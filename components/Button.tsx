import Link from "next/link";

interface Props {
  title: string;
  color: "blue" | "white" | "orange";
  size?: "small";
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
}

const Button = (props: Props) => {
  let colorClasses = "";
  let sizeClasses = "";

  switch (props.color) {
    case "blue":
      colorClasses =
        "bg-online-darkTeal text-online-snowWhite hover:bg-online-darkBlue";
      break;
    case "white":
      colorClasses =
        "bg-online-white text-online-darkTeal hover:bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600";
      break;
    case "orange":
      colorClasses = "bg-online-orange hover:bg-online-darkOrange text-white";
      break;
    default:
      break;
  }

  if (props.size === "small") {
    sizeClasses = "px-5 py-2.5 text-sm";
  } else {
    sizeClasses = "px-6 py-3";
  }

  const className = `font-medium text-center justify-center transition-all rounded-lg shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-1.5 ${colorClasses} ${sizeClasses}`;

  if (props.href) {
    return (
      <Link href={props.href}>
        <a className={className}>
          {props.title}
          {props.icon}
        </a>
      </Link>
    );
  }

  return (
    <button type="button" onClick={props.onClick} className={className}>
      {props.title}
      {props.icon}
    </button>
  );
};

export default Button;

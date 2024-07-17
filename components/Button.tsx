interface Props {
  title: string;
  color: "blue" | "white" | "orange";
  size?: "small";
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: Props) => {
  let colorClasses = "";
  let sizeClasses = "";

  if (props.color === "blue") {
    colorClasses =
      "border bg-online-darkTeal text-online-snowWhite hover:text-online-orange dark:bg-inherit dark:text-green-500 dark:hover:text-online-orange dark:border-green-500 dark:hover:border-online-orange";
  } else if (props.color === "white") {
    colorClasses =
      "bg-online-white text-online-darkTeal hover:text-online-orange border dark:bg-inherit dark:text-white dark:hover:text-online-orange dark:hover:border-online-orange";
  } else if (props.color === "orange") {
    colorClasses =
      "bg-online-orange text-online-snowWhite hover:text-online-darkTeal border dark:bg-inherit dark:text-orange-500 dark:hover:text-online-orange dark:hover:border-online-orange dark:border-orange-500 dark:hover:border-online-orange";
  }

  if (props.size === "small") {
    sizeClasses = "px-5 py-2.5 text-sm";
  } else {
    sizeClasses = "px-6 py-3";
  }

  const className = `font-medium text-center justify-center transition-all rounded-lg shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-1.5 ${colorClasses} ${sizeClasses}`;

  return (
    <button type="button" onClick={props.onClick} className={className}>
      {props.title}
      {props.icon}
    </button>
  );
};

export default Button;

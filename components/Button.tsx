interface Props {
  title: string;
  color: "blue" | "white" | "orange";
  size?: "small";
  icon?: React.ReactNode;
  onClick?: () => void;
}

const Button = (props: Props) => {
  let colorClasses = "";
  let sizeClasses = "";

  if (props.color === "blue") {
    colorClasses =
      "hover:border-online-orange border bg-online-darkTeal text-online-snowWhite hover:text-online-orange dark:bg-green-900 dark:text-white dark:hover:text-online-orange";
  } else if (props.color === "white") {
    colorClasses =
      "hover:border-online-orange bg-online-white text-online-darkTeal hover:text-online-orange border dark:bg-online-darkBlue dark:text-white dark:hover:text-online-orange";
  } else if (props.color === "orange") {
    colorClasses =
      "hover:border-online-darkTeal bg-online-orange text-online-snowWhite hover:text-online-darkTeal border dark:bg-orange-900 dark:text-white dark:hover:text-online-orange";
  }

  if (props.size === "small") {
    sizeClasses = "px-5 py-2.5 text-sm";
  } else {
    sizeClasses = "px-6 py-3";
  }

  const className = `font-medium text-center transition-all rounded-lg shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-1.5 ${colorClasses} ${sizeClasses}`;

  return (
    <button type="button" onClick={props.onClick} className={className}>
      {props.title}
      {props.icon}
    </button>
  );
};

export default Button;

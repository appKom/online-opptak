"use client";

interface Props {
  title: string;
  color: "blue" | "white";
  size?: "small";
  icon?: React.ReactNode;
  onClick?: () => void;
}

const Button = (props: Props) => {
  let colorClasses = "";
  let sizeClasses = "";

  if (props.color === "blue") {
    colorClasses =
      "bg-online-darkTeal text-online-snowWhite hover:text-online-orange";
  } else if (props.color === "white") {
    colorClasses =
      "hover:border-online-orange bg-online-white text-online-darkTeal hover:text-online-orange border";
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

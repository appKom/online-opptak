// import React, { useState } from "react";

// const Collapsible = ({
//   title,
//   children,
//   color = "blue",
//   size,
// }: {
//   title: string;
//   children: React.ReactNode;
//   color?: string;
//   size?: string;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   let colorClasses = "";
//   let sizeClasses = "";

//   if (color === "blue") {
//     colorClasses =
//       "bg-online-darkTeal text-online-snowWhite hover:text-online-orange";
//   } else if (color === "white") {
//     colorClasses =
//       "hover:border-online-orange bg-online-white text-online-darkTeal hover:text-online-orange border";
//   }

//   if (size === "small") {
//     sizeClasses = "px-5 py-2.5 text-sm";
//   } else {
//     sizeClasses = "px-6 py-3";
//   }

//   const className = `font-medium text-center transition-all rounded-lg shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-1.5 ${colorClasses} ${sizeClasses}`;

//   const toggle = () => setIsOpen(!isOpen);

//   return (
//     <div className="collapsible">
//       <button onClick={toggle} className={className}>
//         {title}
//       </button>
//       {isOpen && <div className="collapsible-content">{children}</div>}
//     </div>
//   );
// };

// export default Collapsible;

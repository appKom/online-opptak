import React from "react";

export const SimpleTitle = ({
  title,
  size = "large",
}: {
  title: string;
  size?: "large" | "medium";
}) => {
  let sizeClass;
  let fontWeightClass;

  switch (size) {
    case "medium":
      sizeClass = "text-3xl";
      fontWeightClass = "font-semibold";
      break;
    case "large":
      sizeClass = "text-4xl";
      fontWeightClass = "font-bold";
      break;
  }

  return (
    <h1
      className={`${sizeClass} ${fontWeightClass} tracking-tight text-center text-online-darkBlue dark:text-white`}
    >
      {title}
    </h1>
  );
};

export const MainTitle = ({
  mainTitle,
  boldMainTitle,
  subTitle,
  boldSubTitle,
}: {
  mainTitle?: string;
  boldMainTitle?: string;
  subTitle?: string | React.ReactNode;
  boldSubTitle?: string;
}) => {
  return (
    <div className="w-10/12">
      <div className="w-full">
        <h2 className="mb-2 text-4xl tracking-tight text-gray-900 dark:text-white">
          {boldMainTitle && (
            <span className="font-bold">
              {boldMainTitle}
              {boldMainTitle && mainTitle && ":"}&nbsp;
            </span>
          )}
          {mainTitle}
        </h2>
        {subTitle && (
          <div className="text-xl text-gray-500 dark:text-gray-400">
            {boldSubTitle && (
              <span className="font-semibold">
                {boldSubTitle}
                {boldSubTitle && subTitle && ":"}&nbsp;
              </span>
            )}
            {subTitle}
          </div>
        )}
      </div>
    </div>
  );
};

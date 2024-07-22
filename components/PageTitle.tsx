import React from 'react';

const PageTitle = ({
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
      <div className="w-full my-8">
        <h2 className="mb-2 text-4xl tracking-tight text-gray-900 dark:text-white">
        {boldMainTitle && <span className="font-bold">{boldMainTitle}{boldMainTitle && mainTitle && ":"}&nbsp;</span>}
          {mainTitle}
        </h2>
        {subTitle && (
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {boldSubTitle && <span className="font-semibold">{boldSubTitle}{boldSubTitle && subTitle && ":"}&nbsp;</span>}
            {subTitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
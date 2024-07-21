import React from "react";

const ImportantNote = ({
  prefix,
  text,
  isLoading,
}: {
  prefix: string;
  text: string | React.ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex items-center max-w-full p-4 mx-5 mb-5 text-sm text-yellow-500 rounded-md dark:text-online-orange bg-yellow-50 dark:bg-gray-800">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="flex-shrink-0 w-5 h-5 mr-3"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      {isLoading ? (
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
      ) : (
        <div>
          <b className="mr-2">{prefix}</b>
          {text}
        </div>
      )}
    </div>
  );
};

export default ImportantNote;

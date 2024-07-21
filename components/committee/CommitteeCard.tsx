import router from "next/router";
import React from "react";
import Button from "../Button";

interface Props {
  committee: string;
  link: string;
}

const CommitteeCard = ({ committee, link }: Props) => {
  return (
    <button
      onClick={() => router.push(link)}
      className="relative w-full max-w-md mx-auto break-words border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      <div className="flex flex-col items-center justify-between h-full p-4">
        <h3 className="text-xl text-center font-medium text-gray-900 dark:text-online-snowWhite">
          {committee}
        </h3>
      </div>
    </button>
  );
};

export default CommitteeCard;

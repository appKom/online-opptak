import React from "react";
import Link from "next/link";

interface Props {
  committee: string;
  link: string;
}

const CommitteeCard = ({ committee, link }: Props) => {
  return (
    <Link href={link}>
      <a className="relative w-full max-w-md mx-auto break-words border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        <div className="flex flex-col items-center justify-between h-full p-4">
          <h3 className="text-xl font-medium text-center text-gray-900 dark:text-online-snowWhite">
            {committee}
          </h3>
        </div>
      </a>
    </Link>
  );
};

export default CommitteeCard;

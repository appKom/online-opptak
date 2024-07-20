import router from "next/router";
import React from "react";

interface Props {
  committee: string;
  link: string;
}

const CommitteeCard = ({ committee, link }: Props) => {
  return (
    <button
      className="w-full max-w-md bg-gray-700"
      onClick={() => router.push(link)}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="font-bold text-xl">{committee}</h1>
      </div>
    </button>
  );
};

export default CommitteeCard;

import { useState } from "react";
import { owCommitteeType } from "../lib/types/types";

const CommitteeAboutCard = ({
  image,
  name_long,
  name_short,
  email,
  description_short,
  description_long,
}: owCommitteeType) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-center w-16 h-16 p-1 mb-4 bg-gray-100 rounded-full lg:h-20 lg:w-20 dark:bg-gray-900">
        <img
          src={image?.xs || "/Online_svart_o.svg"}
          alt={name_long}
          className="max-w-full max-h-full"
        />
      </div>
      <h3 className="text-xl font-bold dark:text-white">
        {name_long} {name_long !== name_short && `(${name_short})`}
      </h3>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{email}</p>
      <p className="text-gray-500 dark:text-gray-400">
        {(showMore ? description_long : description_short) ||
          "Ingen beskrivelse :("}
      </p>
      {description_long && description_long != description_short && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="mb-2 text-blue-500 hover:text-blue-700"
        >
          Les {showMore ? "mindre" : "mer"}
        </button>
      )}
    </div>
  );
};

export default CommitteeAboutCard;

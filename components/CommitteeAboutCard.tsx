import { owCommitteeType } from "../lib/types/types";

const CommitteeAboutCard = ({
  image,
  name_long,
  name_short,
  email,
  description_short,
  desctiption_long,
}: owCommitteeType) => {
  return (
    <div>
      <div className="flex items-center justify-center w-16 h-16 p-1 mb-4 bg-gray-100 rounded-full lg:h-20 lg:w-20 dark:bg-gray-900">
        <img src={image?.xs} alt={name_long} />
      </div>
      <h3 className="text-xl font-bold dark:text-white">
        {name_long} {name_long != name_short && "(" + name_short + ")"}
      </h3>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{email}</p>
      <p className="text-gray-500 dark:text-gray-400">
        {description_short || "Ingen beskrivelse :("}
      </p>
    </div>
  );
};

export default CommitteeAboutCard;

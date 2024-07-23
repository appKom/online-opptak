import { owCommitteeType } from "../lib/types/types";

interface CommitteeAboutCardProps {
  committee: owCommitteeType;
  hasPeriod: boolean;
}

const CommitteeAboutCard = ({
  committee,
  hasPeriod,
}: CommitteeAboutCardProps) => {
  const { image, name_long, name_short, email, application_description } =
    committee;

  return (
    <div>
      <div className="flex flex-row justify-between w-full h-16 p-1 mb-4 rounded-full">
        <img
          src={image?.xs || "/Online_svart_o.svg"}
          alt={name_long}
          className="max-w-full max-h-full bg-white rounded-full p-1"
        />
        {hasPeriod && (
          <p className="flex-grow text-right">
            <span className="bg-green-200 text-green-700 p-1 rounded-lg">
              Har opptak!
            </span>
          </p>
        )}
      </div>

      <h3 className="text-xl font-bold dark:text-white">
        {name_long} {name_long !== name_short && `(${name_short})`}
      </h3>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{email}</p>
      <p className="text-gray-500 whitespace-pre-wrap dark:text-gray-400">
        {application_description || "Ingen opptaksbeskrivelse"}
      </p>
    </div>
  );
};

export default CommitteeAboutCard;

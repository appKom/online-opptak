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
      <img
        src={image?.xs || "/Online_svart_o.svg"}
        alt={name_long}
        className="w-16 h-16 p-1 mb-2 bg-white rounded-full"
      />

      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold dark:text-white">
          {name_long} {name_long !== name_short && `(${name_short})`}
        </h3>
        {hasPeriod && (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Har opptak!</span>
        )}
            </div>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{email}</p>
      <p className="text-gray-500 whitespace-pre-wrap dark:text-gray-400">
        {application_description || "Ingen opptaksbeskrivelse"}
      </p>
    </div>
  );
};

export default CommitteeAboutCard;

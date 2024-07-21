import Image from "next/image";

interface Props {
  name: string;
  email: string;
  description: string;
  imageUri: string;
}

const CommitteeOverviewCard = ({
  name,
  email,
  description,
  imageUri,
}: Props) => {
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-700 shadow-md rounded-lg">
      <div className="flex flex-col gap-2 p-4">
        <div className="relative w-full h-auto">
          <Image
            src={imageUri}
            layout="responsive"
            width={400}
            height={400}
            objectFit="cover"
            alt={name}
          />
        </div>
        <h1 className="font-bold text-center text-2xl mt-2">{name}</h1>
        <p className="text-gray-700 dark:text-gray-300 text-center">{email}</p>
        <p className="rounded-md border-2 dark:border-white p-4 whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CommitteeOverviewCard;

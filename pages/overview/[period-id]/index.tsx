import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommitteeOverviewCard from "../../../components/CommitteOverviewCard";
import LoadingPage from "../../../components/LoadingPage";
import { useRouter } from "next/router";
import { periodType } from "../../../lib/types/types";

const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const periodId = router.query["period-id"];
  const [period, setPeriod] = useState<periodType | null>(null);
  const [availableCommittees, setAvailableCommittees] = useState<
    {
      name: string;
      value: string;
      email: string;
      imageUri: string;
      description: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchPeriod = async (updateCache = false) => {
      try {
        const cachedPeriod = localStorage.getItem(`period-${periodId}`);
        if (cachedPeriod && !updateCache) {
          setPeriod(JSON.parse(cachedPeriod));
        } else {
          const res = await fetch(`/api/periods/${periodId}`);
          const data = await res.json();
          setPeriod(data.period);
          localStorage.setItem(
            `period-${periodId}`,
            JSON.stringify(data.period)
          );
        }
      } catch (error) {
        console.error("Failed to fetch interview periods:", error);
      }
    };

    if (periodId) {
      fetchPeriod();
      fetchPeriod(true); // Update cache in the background
    }
  }, [periodId]);

  useEffect(() => {
    const fetchCommittees = async (updateCache = false) => {
      try {
        const cachedCommittees = localStorage.getItem("ow-committees");
        if (cachedCommittees && !updateCache) {
          const committees = JSON.parse(cachedCommittees);
          if (period) {
            const filteredCommittees = committees.filter(
              ({ name_short }: { name_short: string }) =>
                period.committees.includes(name_short) ||
                period.optionalCommittees.includes(name_short) ||
                "Bankom" === name_short
            );

            setAvailableCommittees(
              filteredCommittees.map(
                ({
                  name_short,
                  email,
                  imageUri,
                  description,
                }: {
                  name_short: string;
                  email: string;
                  imageUri: string;
                  description: string;
                }) => ({
                  name: name_short,
                  email: email,
                  imageUri: imageUri || "/Online_bla_o.svg",
                  description: description,
                })
              )
            );
          }
        } else {
          const response = await fetch("/api/periods/ow-committees");
          if (!response.ok) throw new Error("Failed to fetch committees");
          const committees = await response.json();
          console.log(committees);
          localStorage.setItem("ow-committees", JSON.stringify(committees));

          if (period) {
            const filteredCommittees = committees.filter(
              ({ name_short }: { name_short: string }) =>
                period.committees.includes(name_short) ||
                period.optionalCommittees.includes(name_short) ||
                "Bankom" === name_short
            );

            setAvailableCommittees(
              filteredCommittees.map(
                ({
                  name_short,
                  email,
                  imageUri,
                  description,
                }: {
                  name_short: string;
                  email: string;
                  imageUri: string;
                  description: string;
                }) => ({
                  name: name_short,
                  email: email,
                  imageUri: imageUri || "/Online_bla_o.svg",
                  description: description,
                })
              )
            );
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Error: Klarte ikke å hente komiteene");
      } finally {
        setIsLoading(false);
      }
    };

    if (period) {
      fetchCommittees();
      fetchCommittees(true);
    }
  }, [period]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col items-center px-5 gap-5">
      <h1 className="font-bold text-4xl pt-10">
        Velkommen til Onlines komiteer!
      </h1>
      <p className="text-xl w-full max-w-lg py-8">
        Komitémedlemmene våre får Online til å gå rundt, og arbeider for at alle
        informatikkstudenter skal ha en flott studiehverdag.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {availableCommittees.map((committee) => (
          <CommitteeOverviewCard
            key={committee.name}
            name={committee.name}
            email={committee.email}
            description={committee.description}
            imageUri={committee.imageUri}
          />
        ))}
      </div>
    </div>
  );
};

export default Overview;

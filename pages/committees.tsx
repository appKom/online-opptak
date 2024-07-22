import { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";
import { owCommitteeType } from "../lib/types/types";
import CommitteeAboutCard from "../components/CommitteeAboutCard";

const Committees = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [committees, setCommittees] = useState<owCommitteeType[]>([]);

  const fetchCommittees = async () => {
    try {
      const response = await fetch("/api/periods/ow-committees");
      const data = await response.json();

      const cachedData = JSON.parse(
        localStorage.getItem("committeesCache") || "[]"
      );

      if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
        localStorage.setItem("committeesCache", JSON.stringify(data));
        setCommittees(data);
      } else {
        setCommittees(cachedData);
      }
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch committees:", error);
      const cachedData = JSON.parse(
        localStorage.getItem("committeesCache") || "[]"
      );
      setCommittees(cachedData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = JSON.parse(
      localStorage.getItem("committeesCache") || "[]"
    );
    if (cachedData.length > 0) {
      setCommittees(cachedData);
      setIsLoading(false);
    }
    fetchCommittees();
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Onlines komiteer
          </h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            Komitémedlemmer får Online til å gå rundt, og arbeider for at alle
            informatikkstudenter skal ha en flott studiehverdag.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
          {committees?.map((committee, index) => {
            return <CommitteeAboutCard {...committee} key={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Committees;

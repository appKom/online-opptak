import { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";
import { owCommitteeType } from "../lib/types/types";

const Committees = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [committees, setCommittees] = useState<owCommitteeType[]>([]);

  const fetchCommittees = async () => {
    try {
      const response = await fetch("/api/periods/ow-committees");
      const data = await response.json();
      setCommittees(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch committees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
            blabla her skal det stå noe om hva en komite er og at man kan se her
            alle komiteer man kan søke på osv.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
          {committees?.map((committee, index) => {
            return (
              <div key={index}>
                <div className="flex items-center justify-center w-16 h-16 p-1 mb-4 bg-gray-100 rounded-full lg:h-20 lg:w-20 dark:bg-gray-900">
                  <img src={committee.image?.xs} alt={committee.name_long} />
                </div>
                <h3 className="text-xl font-bold dark:text-white">
                  {committee.name_long}{" "}
                  {committee.name_long != committee.name_short &&
                    "(" + committee.name_short + ")"}
                </h3>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {committee.email}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {committee.application_description || "Ingen beskrivelse :("}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Committees;

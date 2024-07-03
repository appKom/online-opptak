import { useEffect, useState, ChangeEvent } from "react";
import Button from "../Button";
import TextAreaInput from "../form/TextAreaInput";
import LoadingPage from "../LoadingPage";
import { useRouter } from "next/router";
import { committeeInterviewType, periodType } from "../../lib/types/types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
  period: periodType | null;
}

const PlanInterview = ({ period }: Props) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const periodId = router.query["period-id"] as string;
  const [committeeInterviewTimes, setCommitteeInterviewTimes] = useState<
    committeeInterviewType[]
  >([]);
  const [userCommittees, setUserCommittees] = useState<string[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<string>("");
  const [committeeHasSubmitedTimes, setCommitteeHasSubmitedTimes] =
    useState<boolean>(false);

  const [committeeHasSubmitedMessage, setCommitteeHasSubmitedMessage] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchCommitteeInterviewTimes = async () => {
      try {
        const res = await fetch(`/api/committees/times/${periodId}`);
        const data = await res.json();

        if (data && Array.isArray(data.committees)) {
          setCommitteeInterviewTimes(data.committees);
          setIsLoading(false);
        } else {
          console.error(
            "Fetched data does not contain an 'committees' array:",
            data
          );
          setCommitteeInterviewTimes([]);
        }
      } catch (error) {
        console.error("Error fetching committee interview times:", error);
        setCommitteeInterviewTimes([]);
      }
    };

    const getCommonCommittees = () => {
      if (session?.user?.committees && period?.committees) {
        const userCommittees = session.user.committees.map(
          (committee: string) => committee.toLowerCase()
        );
        const periodCommittees = period.committees.map((committee) =>
          committee.toLowerCase()
        );

        const commonCommittees = userCommittees.filter((committee: string) =>
          periodCommittees.includes(committee)
        );
        // console.log("Common committees:", commonCommittees);

        setUserCommittees(commonCommittees);

        if (commonCommittees.length > 0) {
          setSelectedCommittee(commonCommittees[0]);
        }
      }
    };

    getCommonCommittees();
    fetchCommitteeInterviewTimes();
  }, [session, period, periodId]);

  useEffect(() => {
    const committee = committeeInterviewTimes.find(
      (committee) => committee.committee === selectedCommittee
    );
    if (committee) {
      setCommitteeHasSubmitedTimes(true);
      if (committee.message === "") {
        setCommitteeHasSubmitedMessage(false);
      } else {
        setCommitteeHasSubmitedMessage(true);
        setMessage(committee.message);
      }
      setMessage(committee.message || "");
    } else {
      setCommitteeHasSubmitedTimes(false);
      setCommitteeHasSubmitedMessage(false);
      setMessage("");
    }
  }, [selectedCommittee, committeeInterviewTimes]);

  const handleCommitteeSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCommittee(e.target.value);
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/committees/times/${periodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          committee: selectedCommittee,
          message,
        }),
      });

      if (!res.ok) {
        toast.error("Det skjede en feil under innsendingen!");
        throw new Error("Failed to update message");
      }

      const updatedData = await res.json();
      setCommitteeInterviewTimes((prevTimes) =>
        prevTimes.map((committee) =>
          committee.committee === selectedCommittee
            ? { ...committee, message: updatedData.message }
            : committee
        )
      );
      toast.success("Innsending er vellykket!");
    } catch (error) {
      toast.success("Det skjede en feil under innsendingen!");
      console.error("Error updating message:", error);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto mb-5">
      <h1 className="font-bold text-3xl text-center">
        Skriv en egendefinert melding!
      </h1>

      <div className="flex flex-col px-5">
        <label className="">Velg komitee: </label>
        <select
          className="p-2 ml-10 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
          onChange={handleCommitteeSelection}
          value={selectedCommittee}
        >
          {userCommittees.map((committee) => (
            <option key={committee} value={committee}>
              {committee}
            </option>
          ))}
        </select>
      </div>

      {!committeeHasSubmitedTimes && (
        <p className="text-red-500 justify-center items-center text-center">
          For å sende en egendefinert melding må du først fylle ut intervju
          tider for valgt komitee.
        </p>
      )}

      {committeeHasSubmitedTimes && !committeeHasSubmitedMessage && (
        <div className="flex flex-col items-center justify-center">
          <TextAreaInput
            updateInputValues={handleMessageChange}
            value={message}
            label={""}
            placeholder="Hei, så hyggelig at du har søkt Testkom.
          Vi ser fram til møte med deg. Gi oss gjerne beskjed om du har noen spørsmål. Mvh. Testkom. 
          "
          />

          <Button
            title={"Send Melding"}
            color={"blue"}
            onClick={handleSubmit}
          />
        </div>
      )}
      {committeeHasSubmitedTimes && committeeHasSubmitedMessage && (
        <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto my-6 gap-20">
          <div className="block w-full px-3 py-2 m-0 text-base text-gray-700 transition bg-white border border-gray-300 rounded shadow-sm dark:text-white peer bg-clip-padding focus:outline-none placeholder:text-sm dark:bg-gray-900 dark:border-gray-600 h-36">
            <p className="text-start">{message}</p>
          </div>
          <Button
            title={"Rediger Melding"}
            color={"orange"}
            onClick={() => setCommitteeHasSubmitedMessage(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PlanInterview;

import { useEffect, useState } from "react";
import Button from "../Button";
import TextAreaInput from "../form/TextAreaInput";
import { useRouter } from "next/router";
import { committeeInterviewType, periodType } from "../../lib/types/types";
import toast from "react-hot-toast";

interface Props {
  period: periodType | null;
  committee: string;
  committeeInterviewTimes: committeeInterviewType | null;
  tabClicked: number;
}

const SendCommitteeMessage = ({
  period,
  committee,
  committeeInterviewTimes,
}: Props) => {
  const router = useRouter();
  const periodId = router.query["period-id"] as string;

  const [committeeHasSubmitedTimes, setCommitteeHasSubmitedTimes] =
    useState<boolean>(false);

  const [committeeHasSubmitedMessage, setCommitteeHasSubmitedMessage] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (committeeInterviewTimes) {
      setCommitteeHasSubmitedTimes(true);
      if (committeeInterviewTimes.message === "") {
        setCommitteeHasSubmitedMessage(false);
      } else {
        setCommitteeHasSubmitedMessage(true);
        setMessage(committeeInterviewTimes.message);
      }
      setMessage(committeeInterviewTimes.message || "");
    } else {
      setCommitteeHasSubmitedTimes(false);
      setCommitteeHasSubmitedMessage(false);
      setMessage("");
    }
  }, [committeeInterviewTimes]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `/api/committees/times/${periodId}/${committee}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      if (!res.ok) {
        toast.error("Det skjedde en feil under innsendingen!");
        throw new Error("Failed to update message");
      }

      const updatedData = await res.json();
      setMessage(updatedData.message);
      setCommitteeHasSubmitedMessage(true);
      toast.success("Innsending er vellykket!");
    } catch (error) {
      toast.error("Det skjede en feil under innsendingen!");
      console.error("Error updating message:", error);
    }
  };

  if (new Date(period!.applicationPeriod.end) < new Date()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="mt-5 mb-6 text-3xl font-bold">
          Det er ikke lenger mulig å legge inn tider!
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto mb-5 px-10">
      <h1 className="font-bold text-2xl text-center">
        Skriv en egendefinert melding!
      </h1>

      {!committeeHasSubmitedTimes && (
        <p className="text-red-500 text-center">
          For å sende en egendefinert melding må du først fylle ut intervju
          tider for valgt komitee.
        </p>
      )}

      {committeeHasSubmitedTimes && !committeeHasSubmitedMessage && (
        <div className="flex flex-col w-full items-center justify-center">
          <TextAreaInput
            updateInputValues={handleMessageChange}
            value={message}
            label={""}
            maxLength={1000}
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
        <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto my-6">
          <button
            onClick={() => setCommitteeHasSubmitedMessage(false)}
            className="w-full min-h-[162px] px-3 py-2 m-0 text-base whitespace-pre-wrap text-gray-700 transition bg-white border border-gray-300 rounded shadow-sm dark:text-white peer bg-clip-padding focus:outline-none placeholder:text-sm dark:bg-gray-900 dark:border-gray-600 overflow-auto break-words text-left flex items-start"
          >
            <p>{message}</p>
          </button>
          <div className="py-6">
            <Button
              title={"Rediger Melding"}
              color={"orange"}
              onClick={() => setCommitteeHasSubmitedMessage(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SendCommitteeMessage;

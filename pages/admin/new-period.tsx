import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Navbar from "../../components/Navbar";
import TextInput from "../../components/form/TextInput";
import { DeepPartial, periodType } from "../../lib/types/types";
import CheckboxInput from "../../components/form/CheckboxInput";
import DatePickerInput from "../../components/form/DatePickerInput";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import TextAreaInput from "../../components/form/TextAreaInput";

const NewPeriod = () => {
  const router = useRouter();

  const [periodData, setPeriodData] = useState<DeepPartial<periodType>>({
    name: "",
    description: "",
    preparationPeriod: {
      start: undefined,
      end: undefined,
    },
    applicationPeriod: {
      start: undefined,
      end: undefined,
    },
    interviewPeriod: {
      start: undefined,
      end: undefined,
    },
    committees: [],
  });

  const updatePreparationPeriodDates = ({
    start,
    end,
  }: {
    start: string;
    end: string;
  }) => {
    setPeriodData((prevData) => ({
      ...prevData,
      preparationPeriod: {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
      },
    }));
  };

  const updateApplicationPeriodDates = ({
    start,
    end,
  }: {
    start: string;
    end: string;
  }) => {
    setPeriodData((prevData) => ({
      ...prevData,
      applicationPeriod: {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
      },
    }));
  };

  const updateInterviewPeriodDates = ({
    start,
    end,
  }: {
    start: string;
    end: string;
  }) => {
    setPeriodData((prevData) => ({
      ...prevData,
      interviewPeriod: {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
      },
    }));
  };

  const [availableCommittees, setAvailableCommittees] = useState<
    { name: string; value: string; description: string }[]
  >([]);
  const [isLoadingCommittees, setIsLoadingCommittees] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      setIsLoadingCommittees(true);
      try {
        const response = await fetch("/api/periods/ow-committees");
        if (!response.ok) throw new Error("Failed to fetch committees");
        const committees = await response.json();
        setAvailableCommittees(
          committees.map(
            ({ name_short, email }: { name_short: string; email: string }) => ({
              name: name_short,
              value: name_short,
              description: email,
            })
          )
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load committees");
      } finally {
        setIsLoadingCommittees(false);
      }
    };
    fetchCommittees();
  }, []);

  const handleAddPeriod = async () => {
    if (!validatePeriod(periodData)) {
      return;
    }
    try {
      const response = await fetch("/api/periods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(periodData),
      });
      if (!response.ok) {
        throw new Error(`Error creating applicant: ${response.statusText}`);
      }

      toast.success("Periode opprettet");
      router.push("/admin");
    } catch (error) {
      toast.error("Det skjedde en feil, vennligst prøv igjen");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-5">
        <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue">
          Ny søknadsperiode
        </h1>

        <div className="flex flex-col items-center w-full pb-10">
          <TextInput
            label="Navn"
            defaultValue={periodData.name}
            placeholder="Eksempel: Suppleringsopptak vår 2025"
            updateInputValues={(value: string) =>
              setPeriodData({
                ...periodData,
                name: value,
              })
            }
          />

          <TextAreaInput
            label="Beskrivelse"
            placeholder="Flere komiteer søker nye medlemmer til suppleringsopptak. Har du det som trengs? Søk nå og bli en del av vårt fantastiske miljø!
            "
            updateInputValues={(value: string) =>
              setPeriodData({
                ...periodData,
                description: value,
              })
            }
          />

          <DatePickerInput
            label="Forberedelsesperiode"
            updateDates={updatePreparationPeriodDates}
          />
          <DatePickerInput
            label="Søknadsperiode"
            updateDates={updateApplicationPeriodDates}
          />
          <DatePickerInput
            label="Intervjuperiode"
            updateDates={updateInterviewPeriodDates}
          />

          {isLoadingCommittees ? (
            <div className="animate-pulse">Laster komiteer...</div>
          ) : (
            <CheckboxInput
              updateInputValues={(selectedValues: string[]) => {
                setPeriodData({
                  ...periodData,
                  committees: selectedValues,
                });
              }}
              label="Velg komiteer"
              values={availableCommittees}
              required
            />
          )}
        </div>

        <div className="pb-10">
          <Button
            title="Opprett søknadsperiode"
            color="blue"
            onClick={handleAddPeriod}
          />
        </div>
      </div>
    </>
  );
};

export default NewPeriod;

const validatePeriod = (periodData: DeepPartial<periodType>): boolean => {
  const prepStart = periodData.preparationPeriod?.start;
  const prepEnd = periodData.preparationPeriod?.end;
  const appStart = periodData.applicationPeriod?.start;
  const appEnd = periodData.applicationPeriod?.end;
  const intStart = periodData.interviewPeriod?.start;
  const intEnd = periodData.interviewPeriod?.end;

  // Check for undefined or empty fields
  if (
    !periodData.name ||
    !prepStart ||
    !prepEnd ||
    !appStart ||
    !appEnd ||
    !intStart ||
    !intEnd
  ) {
    toast.error("Alle feltene må fylles ut.");
    return false;
  }

  // Check date sequence and overlaps
  if (prepEnd > appStart) {
    toast.error("Forberedelsesperioden må slutte før søknadsperioden starter.");
    return false;
  }

  if (appEnd > intStart) {
    toast.error("Søknadsperioden må slutte før intervju perioden starter.");
    return false;
  }

  // Check for overlapping dates within the same period
  if (prepStart > prepEnd || appStart > appEnd || intStart > intEnd) {
    toast.error("Startdatoer må være før sluttdatoer.");
    return false;
  }

  // Check for at least one committee
  if (periodData.committees?.length === 0) {
    toast.error("Minst én komité må velges.");
    return false;
  }

  // If all checks pass
  return true;
};

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import ApplicationForm from "../../components/form/ApplicationForm";
import CheckboxInput from "../../components/form/CheckboxInput";
import DatePickerInput from "../../components/form/DatePickerInput";
import TextAreaInput from "../../components/form/TextAreaInput";
import TextInput from "../../components/form/TextInput";
import { DeepPartial, periodType } from "../../lib/types/types";
import { validatePeriod } from "../../lib/utils/PeriodValidator";

const NewPeriod = () => {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);

  const [periodData, setPeriodData] = useState<DeepPartial<periodType>>({
    name: "",
    description: "",
    applicationPeriod: {
      start: undefined,
      end: undefined,
    },
    interviewPeriod: {
      start: undefined,
      end: undefined,
    },
    committees: [],
    optionalCommittees: [],
    hasSentInterviewTimes: false,
  });

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

  const handlePreviewPeriod = () => {
    setShowPreview((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-5">
        <h1 className="my-10 text-3xl font-semibold text-center text-online-darkBlue dark:text-white">
          Ny opptaksperiode
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
          <div className="w-full max-w-xs">
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
          </div>

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
            <div>
              <CheckboxInput
                updateInputValues={(selectedValues: string[]) => {
                  setPeriodData({
                    ...periodData,
                    committees: selectedValues,
                  });
                }}
                label="Velg komiteer"
                values={availableCommittees}
                order={1}
                required
              />
              <CheckboxInput
                updateInputValues={(selectedValues: string[]) => {
                  setPeriodData({
                    ...periodData,
                    optionalCommittees: selectedValues,
                  });
                }}
                order={2}
                label="Velg valgfrie komiteer"
                values={availableCommittees}
                info=" Valgfrie komiteer er komiteene som søkere kan velge i
                    tillegg til de maksimum 3 komiteene de kan søke på.
                    Eksempelvis: FeminIT"
              />
            </div>
          )}
        </div>
        <div>
          <div className="flex gap-5 pb-10">
            <Button
              title={
                showPreview ? "Skjul forhåndsvisning" : "Se forhåndsvisning"
              }
              color="white"
              onClick={handlePreviewPeriod}
            />
            <Button
              title="Opprett opptaksperiode"
              color="blue"
              onClick={handleAddPeriod}
            />
          </div>
        </div>
        {showPreview && (
          <div className="w-full max-w-lg p-5 mx-auto mt-5 border border-gray-200 rounded-lg shadow dark:border-gray-700">
            <ApplicationForm
              applicationData={periodData}
              setApplicationData={() => {}}
              availableCommittees={
                (periodData.committees?.filter(Boolean) as string[]) || []
              }
              optionalCommittees={
                (periodData.optionalCommittees?.filter(Boolean) as string[]) ||
                []
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NewPeriod;

import { useState } from "react";
import { ApplicationForm } from "./ApplicationForm";
import { applicantType, DeepPartial, periodType } from "../../lib/types/types";
import Button from "../Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editApplicant } from "../../lib/api/applicantApi";
import toast from "react-hot-toast";
import { validateApplication } from "../../lib/utils/validateApplication";
import { Tabs } from "../Tabs";
import CheckBoxIcon from "../icons/icons/CheckBoxIcon";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Schedule from "../committee/Schedule";

interface Props {
  originalApplicationData: applicantType;
  period: periodType;
  availableCommittees: string[];
  optionalCommittees: string[];
  setIsEditing: (isEditing: boolean) => void;
}

const ApplicationEditModal = ({
  availableCommittees,
  optionalCommittees,
  period,
  originalApplicationData,
  setIsEditing,
}: Props) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [applicationData, setApplicationData] = useState<
    DeepPartial<applicantType>
  >({
    owId: originalApplicationData.owId,
    name: originalApplicationData.name,
    email: originalApplicationData.email,
    phone: originalApplicationData.phone,
    grade: originalApplicationData.grade,
    about: originalApplicationData.about,
    bankom: originalApplicationData.bankom,

    optionalCommittees: originalApplicationData.optionalCommittees,
    preferences: originalApplicationData.preferences,
    selectedTimes: originalApplicationData.selectedTimes,
  });

  const submitEdit = () => {
    if (!validateApplication(applicationData)) return;

    editApplicationMutation.mutate({
      applicant: applicationData as applicantType,
      periodId: period._id.toString(),
      owId: originalApplicationData.owId,
    });
  };

  const editApplicationMutation = useMutation({
    mutationFn: editApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "applicant",
          period._id.toString(),
          originalApplicationData.owId,
        ],
      });
      toast.success("Søknad oppdatert successfully");
      setIsEditing(false);
    },
    onError: () => toast.error("Det skjedde en feil, vennligst prøv igjen"),
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen pt-4 px-5 pb-20 text-center">
        <div className="bg-white">
          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Rediger søknad
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Du kan redigere søknaden din her. Husk å lagre endringene før du
                lukker.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 max-w-md">
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              content={[
                {
                  title: "Søknad",
                  icon: <CheckBoxIcon className="w-5 h-5" />,
                  content: (
                    <>
                      <ApplicationForm
                        applicationData={applicationData}
                        setApplicationData={setApplicationData}
                        availableCommittees={availableCommittees}
                        optionalCommittees={optionalCommittees}
                        isEditing={true}
                      />
                      <div className="flex justify-center w-full">
                        <Button
                          title="Videre"
                          color="blue"
                          onClick={() => {
                            if (!validateApplication(applicationData)) return;
                            setActiveTab(activeTab + 1);
                          }}
                          size="small"
                        />
                      </div>
                    </>
                  ),
                },
                {
                  title: "Intervjutider",
                  icon: <CalendarIcon className="w-5 h-5" />,
                  content: (
                    <div className="flex flex-col items-center justify-center">
                      <Schedule
                        interviewLength={Number(30)}
                        periodTime={period?.interviewPeriod}
                        setApplicationData={setApplicationData}
                        applicationData={applicationData}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="flex flex-row gap-6 justify-center">
            <Button
              title="Lukk"
              color="white"
              onClick={() => setIsEditing(false)}
            />
            <Button title="Lagre endringer" color="blue" onClick={submitEdit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationEditModal;

import { useState } from "react";
import { ApplicationForm } from "./ApplicationForm";
import { applicantType, DeepPartial, periodType } from "../../lib/types/types";
import Button from "../Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editApplicant } from "../../lib/api/applicantApi";
import toast from "react-hot-toast";
import { validateApplication } from "../../lib/utils/validateApplication";

interface Props {
  originalApplicationData: applicantType;
  periodId: string;
  availableCommittees: string[];
  optionalCommittees: string[];
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const ApplicationEditModal = ({
  availableCommittees,
  optionalCommittees,
  periodId,
  originalApplicationData,
  isEditing,
  setIsEditing,
}: Props) => {
  const queryClient = useQueryClient();

  const [applicationData, setApplicationData] = useState<
    DeepPartial<applicantType>
  >({
    owId: originalApplicationData.owId,
    name: originalApplicationData.name,
    email: originalApplicationData.email,
    phone: originalApplicationData.phone,
    grade: originalApplicationData.grade,
    about: originalApplicationData.about,
    optionalCommittees: originalApplicationData.optionalCommittees,
    preferences: originalApplicationData.preferences,
    selectedTimes: originalApplicationData.selectedTimes,
  });

  const submitEdit = () => {
    if (!validateApplication(applicationData)) return;

    editApplicationMutation.mutate({
      applicant: applicationData as applicantType,
      periodId,
      owId: originalApplicationData.owId,
    });
  };

  const editApplicationMutation = useMutation({
    mutationFn: editApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicant", periodId, originalApplicationData.owId],
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
          <div className="mt-5 sm:mt-4">
            <ApplicationForm
              applicationData={applicationData}
              setApplicationData={setApplicationData}
              availableCommittees={availableCommittees}
              optionalCommittees={optionalCommittees}
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

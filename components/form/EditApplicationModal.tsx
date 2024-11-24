"use client";

import { useState } from "react";
import { ApplicationForm } from "./ApplicationForm";
import { applicantType, DeepPartial, periodType } from "../../lib/types/types";
import { useSession } from "next-auth/react";
import Button from "../Button";

interface Props {
  period: periodType | undefined;
  availableCommittees: string[];
  optionalCommittees: string[];
}

const ApplicationEditModal = ({
  period,
  availableCommittees,
  optionalCommittees,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const [applicationData, setApplicationData] = useState<
    DeepPartial<applicantType>
  >({
    owId: session?.user?.owId,
    name: session?.user?.name,
    email: session?.user?.email,
    phone: session?.user?.phone || "",
    grade: "1",
    about: "",
    optionalCommittees: [],
    preferences: {
      first: "",
      second: "",
      third: "",
    },
  });

  const submitEdit = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        title="Rediger søknad"
        color="blue"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Rediger søknad
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Du kan redigere søknaden din her. Husk å lagre
                        endringene før du lukker.
                      </p>
                    </div>
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
                <div className="flex flex-row gap-6">
                  <Button
                    title="Lukk"
                    color="white"
                    onClick={() => setIsOpen(false)}
                  />
                  <Button
                    title="Lagre endringer"
                    color="blue"
                    onClick={submitEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationEditModal;

import TextInput from "./TextInput";
import RadioInput from "./RadioInput";
import TextAreaInput from "./TextAreaInput";
import SelectInput from "./SelectInput";
import Line from "./Line";
import { DeepPartial, applicantType } from "../../lib/types/types";
import { changeDisplayName } from "../../lib/utils/toString";
import { useState } from "react";

interface Props {
  applicationData: DeepPartial<applicantType>;
  setApplicationData: Function;
  availableCommittees: string[];
  optionalCommittees: string[];
}

export const ApplicationForm = (props: Props) => {
  const availableCommittees = [["Ingen", ""]];
  const [selectedOptionalCommittees, setSelectedOptionalCommittees] = useState<
    string[]
  >([]);

  props.availableCommittees.forEach((committee) => {
    if (!availableCommittees.some((item) => item[1] === committee)) {
      availableCommittees.push([committee, committee.toLowerCase()]);
    }
  });

  const optionalCommittees: string[] = props.optionalCommittees.map(
    (committee) => committee.toLowerCase()
  );

  const addOptionalCommittee = (committee: string, value: string) => {
    let updatedCommittees = [...selectedOptionalCommittees];

    if (value === "yes" && !updatedCommittees.includes(committee)) {
      updatedCommittees.push(committee);
    } else if (value === "no" && updatedCommittees.includes(committee)) {
      updatedCommittees = updatedCommittees.filter(
        (item) => item !== committee
      );
    }

    setSelectedOptionalCommittees(updatedCommittees);
    props.setApplicationData({
      ...props.applicationData,
      optionalCommittees: updatedCommittees,
    });
  };

  return (
    <div className="flex justify-center items-center">
      <form className="px-5 text-online-darkBlue dark:text-white max-w-sm w-full">
        <TextInput
          label={"E-postadresse"}
          defaultValue={props.applicationData.email}
          updateInputValues={(value: string) =>
            props.setApplicationData({ ...props.applicationData, email: value })
          }
        />
        <TextInput
          label={"Fullt navn"}
          defaultValue={props.applicationData.name}
          updateInputValues={(value: any) =>
            props.setApplicationData({ ...props.applicationData, name: value })
          }
        />
        <TextInput
          label={"Telefonummer"}
          defaultValue={props.applicationData.phone}
          updateInputValues={(value: any) =>
            props.setApplicationData({ ...props.applicationData, phone: value })
          }
        />
        <SelectInput
          required
          defaultValue={
            props.applicationData.grade === undefined
              ? "Velg trinn"
              : props.applicationData.grade
          }
          values={[
            ["1.", 1],
            ["2.", 2],
            ["3.", 3],
            ["4.", 4],
            ["5.", 5],
          ]}
          label={"Hvilket trinn går du?"}
          updateInputValues={(value: number) =>
            props.setApplicationData({
              ...props.applicationData,
              grade: value,
            })
          }
        />
        <Line />
        <TextAreaInput
          label={"Skriv litt om deg selv"}
          updateInputValues={(value: any) =>
            props.setApplicationData({ ...props.applicationData, about: value })
          }
          maxLength={1000}
        />
        <Line />
        <div className="flex justify-center">
          <label className="inline-block mt-6 text-gray-700 dark:text-white form-label">
            {availableCommittees.length > 2
              ? `Velg opp til 3 komiteer`
              : `Velg opp til ${availableCommittees.length - 1} komiteer`}
          </label>
        </div>
        <SelectInput
          required
          values={availableCommittees}
          label={availableCommittees.length > 2 ? "Førstevalg" : "Velg komite"}
          updateInputValues={(value: string) =>
            props.setApplicationData({
              ...props.applicationData,
              preferences: {
                ...props.applicationData.preferences,
                first: value,
              },
            })
          }
        />

        {availableCommittees.length > 2 && (
          <SelectInput
            values={availableCommittees}
            label={"Andrevalg"}
            updateInputValues={(value: string) =>
              props.setApplicationData({
                ...props.applicationData,
                preferences: {
                  ...props.applicationData.preferences,
                  second: value,
                },
              })
            }
          />
        )}
        {availableCommittees.length > 3 && (
          <SelectInput
            values={availableCommittees}
            label={"Tredjevalg"}
            updateInputValues={(value: string) =>
              props.setApplicationData({
                ...props.applicationData,
                preferences: {
                  ...props.applicationData.preferences,
                  third: value,
                },
              })
            }
          />
        )}
        <Line />
        <RadioInput
          values={[
            ["Ja", "yes"],
            ["Nei", "no"],
            ["Usikker (gjerne spør om mer info på intervjuet)", "maybe"],
          ]}
          label={
            "Er du interessert i å være økonomiansvarlig i komiteen (tilleggsverv i Bankom)?"
          }
          updateInputValues={(value: boolean) =>
            props.setApplicationData({
              ...props.applicationData,
              bankom: value,
            })
          }
        />
        {optionalCommittees.map((committee) => (
          <div key={committee}>
            <RadioInput
              values={[
                ["Ja", "yes"],
                ["Nei", "no"],
              ]}
              label={`Ønsker du å søke ${changeDisplayName(
                committee
              )} i tillegg?`}
              updateInputValues={(value: string) =>
                addOptionalCommittee(committee, value)
              }
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default ApplicationForm;

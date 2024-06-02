import TextInput from "./TextInput";
import RadioInput from "./RadioInput";
import TextAreaInput from "./TextAreaInput";
import SelectInput from "./SelectInput";
import Line from "./Line";
import { DeepPartial, applicantType } from "../../lib/types/types";
import { useEffect } from "react";

interface Props {
  applicationData: DeepPartial<applicantType>;
  setApplicationData: Function;
  availableCommittees: string[];
  optionalCommittees: string[];
}

export const ApplicationForm = (props: Props) => {
  const availableCommittees = [["Ingen", ""]];

  props.availableCommittees.forEach((committee) => {
    if (!availableCommittees.some((item) => item[1] === committee)) {
      availableCommittees.push([committee, committee.toLowerCase()]);
    }
  });

  const addOptionalCommittee = (committee: string, value: string) => {
    const updatedOptionalCommittees =
      value === "yes"
        ? [...props.optionalCommittees, committee]
        : props.optionalCommittees.filter((item) => item !== committee);

    props.setApplicationData({
      ...props.applicationData,
      optionalCommittees: updatedOptionalCommittees,
    });
  };

  return (
    <form className="px-5 text-online-darkBlue dark:text-white">
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
            preferences: { ...props.applicationData.preferences, first: value },
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
          "Er du interessert i å være økonomiansvarlig i komiteen (tilleggsverv i Bankkom)?"
        }
        updateInputValues={(value: boolean) =>
          props.setApplicationData({
            ...props.applicationData,
            bankom: value,
          })
        }
      />
      {props.optionalCommittees.map((committee) => (
        <div key={committee}>
          <RadioInput
            values={[
              ["Ja", "yes"],
              ["Nei", "no"],
            ]}
            label={`Ønsker du å søke i ${committee} i tillegg?`}
            updateInputValues={(value: string) =>
              addOptionalCommittee(committee, value)
            }
          />
        </div>
      ))}
    </form>
  );
};

export default ApplicationForm;

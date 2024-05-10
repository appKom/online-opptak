import TextInput from "./TextInput";
import RadioInput from "./RadioInput";
import TextAreaInput from "./TextAreaInput";
import SelectInput from "./SelectInput";
import Line from "./Line";
import { DeepPartial, applicantType } from "../../lib/types/types";

interface Props {
  applicationData: DeepPartial<applicantType>;
  setApplicationData: Function;
  availableCommittees: string[];
}

export const ApplicationForm = (props: Props) => {
  const availableCommittees = [["Ingen", ""]];

  props.availableCommittees.forEach((committee) => {
    if (!availableCommittees.some((item) => item[1] === committee)) {
      availableCommittees.push([committee, committee.toLowerCase()]);
    }
  });

  const isFeminITAvailable = props.availableCommittees.includes("FeminIT");

  return (
    <form className="px-5">
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
        <label className="inline-block mt-6 text-gray-700 form-label">
          Velg opp til 3 komiteer
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
      {isFeminITAvailable && (
        <RadioInput
          values={[
            ["Ja", "yes"],
            ["Nei", "no"],
          ]}
          label={"Ønsker du å søke FeminIT i tillegg?"}
          updateInputValues={(value: boolean) =>
            props.setApplicationData({
              ...props.applicationData,
              feminIt: value,
            })
          }
        />
      )}
    </form>
  );
};

export default ApplicationForm;

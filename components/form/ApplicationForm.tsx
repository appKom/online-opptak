import TextInput from "./TextInput";
import RadioInput from "./RadioInput";
import TextAreaInput from "./TextAreaInput";
import SelectInput from "./SelectInput";
import Line from "./Line";

interface Props {
  applicationData: {
    name: string;
    email: string;
    phone: string;
    about: string;
    grade: number;
    bankom: boolean;
    feminIt: boolean;
    preferences: {
      first: string;
      second: string;
      third: string;
    };
  };
  setApplicationData: Function;
}

export const ApplicationForm = (props: Props) => {
  const availableCommittees = [
    ["Ingen", ""],
    ["Arrkom", "arrkom"],
    ["Appkom", "appkom"],
    ["Bedkom", "bedkom"],
    ["Dotkom", "dotkom"],
    ["Fagkom", "fagkom"],
    ["Online IL", "onlineil"],
    ["Prokom", "prokom"],
    ["Trikom", "trikom"],
    ["Realfagskjelleren", "realfagskjelleren"],
  ];

  return (
    <form className="px-5">
      <TextInput
        label={"E-postadresse"}
        defaultValue={props.applicationData.email}
        disabled
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
        defaultValue="Velg trinn"
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
        <label className="inline-block form-label text-gray-700 mt-6">
          Velg opp til 3 komitéer
        </label>
      </div>
      <SelectInput
        required
        values={availableCommittees}
        label={"Førstevalg"}
        updateInputValues={(value: string) =>
          props.setApplicationData({
            ...props.applicationData,
            preferences: { ...props.applicationData.preferences, first: value },
          })
        }
      />
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
      <SelectInput
        values={availableCommittees}
        label={"Tredjevalg"}
        updateInputValues={(value: string) =>
          props.setApplicationData({
            ...props.applicationData,
            preferences: { ...props.applicationData.preferences, third: value },
          })
        }
      />
      <Line />

      <RadioInput
        values={[
          ["Ja", true],
          ["Nei", false],
          ["Usikker (gjerne spør om mer info på intervjuet)"],
        ]}
        label={
          "Er du interessert i å være økonomiansvarlig i komitéen (tilleggsverv i Bankkom)?"
        }
        updateInputValues={(value: boolean) =>
          props.setApplicationData({ ...props.applicationData, bankom: value })
        }
      />

      <RadioInput
        values={[
          ["Ja", true],
          ["Nei", false],
        ]}
        label={"Ønsker du å søke FeminIT i tillegg?"}
        updateInputValues={(value: boolean) =>
          props.setApplicationData({ ...props.applicationData, feminIt: value })
        }
      />
    </form>
  );
};

export default ApplicationForm;

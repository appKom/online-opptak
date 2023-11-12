import InputComponent from "./inputcomponent";
import RadioComponent from "./radiocomponent";
import TextAreaComponent from "./textareacomponent";
import SelectComponent from "./selectcomponent";
import { useState } from "react";
import { applicantType } from "../../types/types";
import Line from "./Line";
import axios from "axios";
import validator from "validator";
import toast from "react-hot-toast";

export const OpptaksForm = () => {
  const [data, setData] = useState<applicantType>({
    name: "",
    email: "",
    phone: "",
    about: "",
    grade: 0,
    bankom: false,
    feminIt: false,
    preferences: {
      first: "",
      second: "",
      third: "",
    },
  });

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

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!validator.isEmail(data.email)) {
      toast.error("Fyll inn en gyldig e-postadresse");
      return;
    }
    if (!validator.isMobilePhone(data.phone, "nb-NO")) {
      toast.error("Fyll inn et gyldig mobilnummer");
      return;
    }
    if (
      data.preferences.first === data.preferences.second ||
      data.preferences.first === data.preferences.third ||
      (data.preferences.second &&
        data.preferences.second === data.preferences.third)
    ) {
      toast.error("Du kan ikke velge samme komité flere ganger");
      return;
    }
    try {
      const response = await axios.post("/api/applicants", data);
      toast.success("Søknad sendt inn. Du vil få en bekreftelse på mail");
      console.log("Response:", response.data);
    } catch (error) {
      toast.error("Det skjedde en feil, vennligst prøv igjen");
      console.error("Error:", error);
    }
  };

  return (
    <div className="py-5">
      <header className="mt-5">
        <h2 className="mb-4 text-4xl font-bold text-center text-online-blueGray">
          Komitésøknad 2024
        </h2>
      </header>
      <form onSubmit={handleSubmit}>
        <InputComponent
          label={"E-postadresse"}
          updateInputValues={(value: string) =>
            setData({ ...data, email: value })
          }
        />
        <Line />
        <InputComponent
          label={"Fullt navn"}
          updateInputValues={(value: any) => setData({ ...data, name: value })}
        />
        <Line />

        <InputComponent
          label={"Telefonummer"}
          updateInputValues={(value: any) => setData({ ...data, phone: value })}
        />
        <Line />

        <RadioComponent
          values={[
            ["1.", 1],
            ["2.", 2],
            ["3.", 3],
            ["4.", 4],
            ["5.", 5],
          ]}
          label={"Hvilket år er du på i informatikkstudiet?"}
          updateInputValues={(value: number) =>
            setData({ ...data, grade: value })
          }
        />
        <Line />

        <TextAreaComponent
          label={"Skriv litt om deg selv"}
          updateInputValues={(value: any) => setData({ ...data, about: value })}
        />
        <Line />

        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <label className="form-label inline-block mb-2 text-black-700 text-lg">
              Velg opp til 3 komiteer
            </label>
          </div>
        </div>
        <SelectComponent
          required
          values={availableCommittees}
          label={"Førstevalg: "}
          updateInputValues={(value: string) =>
            setData({
              ...data,
              preferences: { ...data.preferences, first: value },
            })
          }
        />
        <SelectComponent
          values={availableCommittees}
          label={"Andrevalg: "}
          updateInputValues={(value: string) =>
            setData({
              ...data,
              preferences: { ...data.preferences, second: value },
            })
          }
        />
        <SelectComponent
          values={availableCommittees}
          label={"Tredjevalg: "}
          updateInputValues={(value: string) =>
            setData({
              ...data,
              preferences: { ...data.preferences, third: value },
            })
          }
        />
        <Line />

        <RadioComponent
          values={[
            ["Ja", true],
            ["Nei", false],
            ["Usikker (gjerne spør om mer info på intervjuet)"],
          ]}
          label={
            "Er du interessert i å være økonomiansvarlig (tilleggsverv i Bankkom)?"
          }
          updateInputValues={(value: boolean) =>
            setData({ ...data, bankom: value })
          }
        />
        <Line />

        <RadioComponent
          values={[
            ["Ja", true],
            ["Nei", false],
          ]}
          label={"Ønsker du å søke FeminIT?"}
          updateInputValues={(value: boolean) =>
            setData({ ...data, feminIt: value })
          }
        />
        {/* TODO: legg inn ledige tider */}
        <div className="m-5 flex space-x-2 justify-center">
          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-online-darkTeal text-online-white font-medium text-xs uppercase rounded shadow hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Send inn søknad
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpptaksForm;

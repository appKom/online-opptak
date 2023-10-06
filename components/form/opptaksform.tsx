import * as React from "react";

import InputComponent from "./inputcomponent";
import RadioComponent from "./radiocomponent";
import TextAreaComponent from "./textareacomponent";
import SelectComponent from "./selectcomponent";
import { DBapplicant } from "../../types";
import Line from "./line";
import { useState } from "react";
interface FormData {
  name: string;
  email: string;
  phone: string;
  about: string;
  informatikkyear: number;
  committeechoice1: string;
  committeechoice2: string;
  committeechoice3: string;
  bankkom: string;
  feminit: string;
}

const OpptaksForm = () => {
  const [state, setState] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    about: "",
    informatikkyear: 0,
    committeechoice1: "",
    committeechoice2: "",
    committeechoice3: "",
    bankkom: "",
    feminit: "",
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    console.log(state);
    return;

    try {
      const response = await fetch("/api/postApplicant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            id: 0,
            feminit: state.feminit,
            about: state.about,
            bankkom: state.bankkom,
            committeechoice1: state.committeechoice1,
            committeechoice2: state.committeechoice2,
            committeechoice3: state.committeechoice3,
            email: state.email,
            informatikkyear: state.informatikkyear,
            availableTimes: [],
            name: state.name,
            phone: state.phone,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Applicant created successfully:", data);
      } else {
        console.error("Failed to create applicant:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating applicant:", error);
    }
  };
  return (
    <div className="mx-5">
      <header className="mt-5">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
          Komitésøknad 2024
        </h2>
      </header>
      <form>
        <InputComponent
          id={"epost"}
          label={"E-postadresse *"}
          updateInputValues={(id: string, value: string) =>
            setState({ ...state, email: value })
          }
        />
        <Line />
        <InputComponent
          id={"navn"}
          label={"Fullt navn *"}
          updateInputValues={(id: any, value: any) =>
            setState({ ...state, name: value })
          }
        />
        <Line />

        <InputComponent
          id={"telefon"}
          label={"Telefonummer *"}
          updateInputValues={(id: any, value: any) =>
            setState({ ...state, phone: value })
          }
        />
        <Line />

        <RadioComponent
          values={[
            ["1.", "1"],
            ["2.", "2"],
            ["3.", "3"],
            ["4.", "4"],
            ["5.", "5"],
          ]}
          id={"informatikkar"}
          label={"Hvilket år er du på i informatikkstudiet? *"}
          updateInputValues={(id: any, value: any) =>
            setState({
              ...state,
              informatikkyear: value,
            })
          }
        />
        <Line />

        <TextAreaComponent
          id={"omdegselv"}
          label={"Skriv litt om deg selv *"}
          updateInputValues={(id: any, value: any) =>
            setState({ ...state, about: value })
          }
        />
        <Line />

        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <label className="form-label inline-block mb-2 text-black-700 text-xl">
              Velg opp til 3 komitéer
            </label>
          </div>
        </div>
        <SelectComponent
          biggerlabel={true}
          values={[
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
          ]}
          id={"komitevalg1"}
          label={"Førstevalg: "}
          updateInputValues={(id: any, value: any) =>
            setState({
              ...state,
              committeechoice1: value,
            })
          }
        />
        <SelectComponent
          biggerlabel={true}
          values={[
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
          ]}
          id={"komitevalg2"}
          label={"Andrevalg: "}
          updateInputValues={(id: any, value: any) =>
            setState({
              ...state,
              committeechoice2: value,
            })
          }
        />
        <SelectComponent
          biggerlabel={true}
          values={[
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
          ]}
          id={"komitevalg3"}
          label={"Tredjevalg: "}
          updateInputValues={(id: any, value: any) =>
            setState({
              ...state,
              committeechoice3: value,
            })
          }
        />
        <Line />

        <RadioComponent
          biggerlabel={true}
          values={[
            ["Ja", "ja"],
            ["Nei", "nei"],
            ["Usikker (gjerne spør om mer info på intervjuet)"],
          ]}
          id={"okonomiansvarliginteresse"}
          label={
            "Er du interessert i å være økonomiansvarlig (tilleggsverv i bankkom)?"
          }
          updateInputValues={(id: any, value: any) =>
            setState({
              ...state,
              bankkom: value,
            })
          }
        />
        <Line />

        <RadioComponent
          biggerlabel={true}
          values={[
            ["Ja", "ja"],
            ["Nei", "nei"],
          ]}
          id={"feminit"}
          label={"FeminIT opptak (valgfritt)?"}
          updateInputValues={(id: any, value: any) =>
            setState({ ...state, feminit: value })
          }
        />
        <div className="m-5 flex space-x-2 justify-center">
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Send inn
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpptaksForm;

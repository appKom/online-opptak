import * as React from "react";

import InputComponent from "./inputcomponent";
import RadioComponent from "./radiocomponent";
import TextAreaComponent from "./textareacomponent";
import SelectComponent from "./selectcomponent";
interface Data {
  navn: string;
  epost: string;
  telefon: string;
  omdegselv: string;
  informatikkar: number;
  komitevalg1: string;
  komitevalg2: string;
  komitevalg3: string;
  okonomiansvarliginteresse: string;
  feminit: string;
}
interface State {
  data: Data;
}

class OpptaksForm extends React.Component<State> {
  state = {
    data: {
      navn: "",
      epost: "",
      telefon: "",
      omdegselv: "",
      informatikkar: 0,
      komitevalg1: "",
      komitevalg2: "",
      komitevalg3: "",
      okonomiansvarliginteresse: "",
      feminit: "",
    },
  };

  handleSubmit = () => {
   // send inn
  };

  updateInputValues = (id: string, value: any) => {
   
    let d: Data = this.state.data;
    d[id] = value;
    this.setState({ data: d });

    console.log(this.state);
  };

  render() {
    return (
      <div>
        <header className="mt-5">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
            Komitésøknad 2023
          </h2>
        </header>
        <form>
        <InputComponent
          id={"epost"}
          label={"E-postadresse *"}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
          }
        />
        <hr className="mt-2 mb-2" style={{width: "400px", margin: "5px auto 10px"}}/>
        <InputComponent 
          id={"navn"}
          label={"Fullt navn *"}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
          }
        />
        <hr className="mt-2 mb-2" style={{width: "400px", margin: "5px auto 10px"}}/>
        
        <InputComponent 
          id={"telefon"}
          label={"Telefonummer *"}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
          }
        />
        <hr className="mt-2 mb-2" style={{width: "400px", margin: "5px auto 10px"}}/>
        
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
            this.updateInputValues(id, value)
          }
        />
        <hr className="mt-2 mb-2" style={{width: "400px", margin: "5px auto 10px" }}/>
        
        <TextAreaComponent
          id={"omdegselv"}
          label={"Skriv litt om deg selv *"}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
          }
        />
        <hr className="mt-2 mb-2" style={{width: "400px", margin: "5px auto 10px"}}/>
        
        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <label className="form-label inline-block mb-2 text-black-700 text-xl">
              Velg opp til 3 komiteer
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
            ["Realfagskjelleren", "realfagskjelleren"]
     
          ]}
          id={"komitevalg1"}
          label={"Førstevalg: "}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
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
            ["Realfagskjelleren", "realfagskjelleren"]
          ]}
          
          id={"komitevalg2"}
          label={"Andrevalg: "}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
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
            ["Realfagskjelleren", "realfagskjelleren"]
           
          ]}
         
          id={"komitevalg3"}
          label={"Tredjevalg: "}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
          }
        />
        <hr className="mt-2 mb-2" style={{width: "400px", margin: "5px auto 10px"}}/>
        
        <RadioComponent
          biggerlabel={true}
          values={[
            ["Ja", "ja"],
            ["Nei", "nei"],
            ["Usikker (gjerne spør om mer informasjon på intervjuet)"],
          ]}
          id={"okonomiansvarliginteresse"}
          label={
            "Er du interessert i å være økonomiansvarlig (tilleggsverv i bankkom)?"
          }
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
          }
        />
        <hr className="mt-2 mb-2" style={{width: "400px", margin: "5px auto 10px"}}/>
        
        <RadioComponent
          biggerlabel={true}
          values={[
            ["Ja", 'ja'],
            ["Nei", 'nei'],
          ]}
          id={"feminit"}
          label={"FeminIT opptak (valgfritt)?"}
          updateInputValues={(id: any, value: any) =>
            this.updateInputValues(id, value)
          }
        />
        <div className="m-5 flex space-x-2 justify-center">
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Send
          </button>
        </div>
        </form>
      </div>
    );
  }
}

export default OpptaksForm;

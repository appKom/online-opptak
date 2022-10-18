import React from "react";
import type { NextPage } from "next";
import OpptaksForm from "../components/form/opptaksform";

const Form: NextPage = () => {
  return (
    <div>
      <OpptaksForm
        data={{
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
        }}
      />
    </div>
  );
};

export default Form;

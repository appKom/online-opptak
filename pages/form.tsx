import React from "react";
import type { NextPage } from "next";
import OpptaksForm from "../components/form/opptaksform";
import Navbar from "../components/navbar";

const Form: NextPage = () => {
  return (
    <div>
      <Navbar />
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

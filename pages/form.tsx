import React from "react";
import type { NextPage } from "next";
import OpptaksForm from "../components/form/opptaksform";
import Navbar from "../components/navbar";

const Form: NextPage = () => {
  return (
    <div>
      <Navbar />
      <OpptaksForm />
    </div>
  );
};

export default Form;

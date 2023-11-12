import React from "react";
import type { NextPage } from "next";
import Navbar from "../components/navbar";
import OpptaksForm from "../components/form/opptaksform";

const Form: NextPage = () => {
  return (
    <div>
      <Navbar />
      <OpptaksForm />
    </div>
  );
};

export default Form;

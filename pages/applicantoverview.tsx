import { NextPage } from "next";
import React from "react";
import Applicantrow from "../components/applicantoverview/applicantrow";
import getApplicants from "../services/getApplicants";
import { DBapplicant } from "../types";
import { useQueryClient, useQuery } from "@tanstack/react-query";


const applicantoverview: NextPage = () => {
    let applicants: String[] = ["Viktor", "Aksel", "David"];
    const { isLoading, isError, isSuccess, data } = useQuery<{applicants : DBapplicant[]}, Error>(
      [],
      getApplicants
    );

    const handleApplicantsRequest = (data: {applicants : DBapplicant[]} | undefined) => {
      console.log(data)
      return <p></p>
    }

    let commitee = "Appkom";
  
  return (
    <div>
      <h1>Søkere til {commitee}</h1>
      {isLoading ? <p>Loading...</p> : handleApplicantsRequest(data)}
    </div>
  );
};

export default applicantoverview;

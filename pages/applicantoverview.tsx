import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Applicantrow from "../components/applicantoverview/applicantrow";
import getApplicants from "../services/getApplicants";
import { DBapplicant } from "../types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Applicant } from "@prisma/client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

const ApplicantOverview: NextPage = () => {
  const { isLoading, isError, isSuccess, data } = useQuery<
    { applicants: Applicant[] },
    Error
  >([], getApplicants);

  const handleApplicantsRequest = (
    data: { applicants: Applicant[] } | undefined
  ) => {
    if (data) {
      return data.applicants.map((a) => (
        <Applicantrow key={a.id.toString()} data={a} committee={commitee} />
      ));
    } else {
      return <tr>Kunne ikke hente data...</tr>;
    }
  };

  const commitee = "appkom";

  const [roomResult, setRoomName] = useState<string>("");

  useEffect(() => {
    getRoomName().then((room) => setRoomName(room));
  }, []);

  const getRoomName = async () => {
    // const doc = new DOMParser()
    // let d = await fetch("https://online.ntnu.no").then(x => x.text());
    // console.log(d);
    // return doc.parseFromString(d, 'text/html').title;
    // const el : string = (document.getElementById("mazeMap") as HTMLInputElement).getElementsByTagName("title")[0].innerText;
    // return el;
    return "A4-119 - Realfagsbygget";
  };

  return (
    <div>
      <Navbar />
      <h1>Søkere til {commitee}</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <tbody>{handleApplicantsRequest(data)}</tbody>
        </table>
      )}
      <span>{roomResult}</span>
      <iframe
        id="mazeMap"
        width="0"
        height="0"
        frameBorder="0"
        scrolling="no"
        src="https://use.mazemap.com/embed.html#v=1&center=10.404579,63.415433&zoom=19.3&zlevel=4&campusid=1&sharepoitype=poi&sharepoi=1000292364&utm_medium=iframe"
      ></iframe>
      {/*<script>
        const doc = new DOMParser().parseFromString((await (await fetch("https://link.mazemap.com/n2afR0Ak")).text()), 'text/html');
        document.getElementById("roomName").innerText = doc.title;
        // getElementById("responsive-card-container").getElementsByTagName("h2")[0].getElementsByTagName("span")[0].innerText;
      </script>
      */}
      <Footer />
    </div>
  );
};

export default ApplicantOverview;

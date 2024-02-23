import type { NextPage } from "next";
import Schedule from "../components/committee/Schedule";
import Navbar from "../components/navbar";
import Toggle from "../components/committee/Toggle";
import { useState } from "react";

const Committee: NextPage = () => {
  const [add, setAdd] = useState(true);

  function handleToggle() {
    console.log("toggle");
    setAdd(!add);
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-2">
        <Toggle onClick={() => handleToggle()}/>
        <p className="text-lg mt-2">{add ? "Legg til intervjutider" : "Fjern intervjutider"}</p>
        <Schedule interviewLength={Number(30)} add={add} />
      </div>
    </>
  );
};

export default Committee;

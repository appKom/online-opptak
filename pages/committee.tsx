import type { NextPage } from "next";
import Toggle from "../components/committee/Toggle";
import Schedule from "../components/committee/Schedule";

import { useState } from "react";
import Navbar from "../components/Navbar";

const Committee: NextPage = () => {
  const [add, setAdd] = useState(true);

  function handleToggle() {
    console.log("toggle");
    setAdd(!add);
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-2">
        <Toggle onClick={() => handleToggle()} />
        <p className="mt-2 text-lg">
          {add ? "Legg til intervjutider" : "Fjern intervjutider"}
        </p>
        <Schedule interviewLength={Number(30)} add={add} />
      </div>
    </>
  );
};

export default Committee;

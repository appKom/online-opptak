import type { NextPage } from "next";
import Schedule from "../components/committee/Schedule";
import Navbar from "../components/navbar";

const Committee: NextPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-2">
        <Schedule interviewLength={Number(30)} />
      </div>
    </>
  );
};

export default Committee;

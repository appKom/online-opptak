import type { NextPage } from "next";
import Schedule from "../components/committee/Schedule";
import styles from "./../styles/schedule.module.css";
import Navbar from "../components/navbar";
import { useState } from "react";

const Committee: NextPage = () => {
  const [interviewLength, setInterviewLength] = useState("20");

  const handleInterviewLengthChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setInterviewLength(event.target.value);
  };
  return (
    <>
      <Navbar />
      <div className={styles.committeePage}>
        <div>
          <label htmlFor="interviewLength">Velg intervjulengde:</label>
          <select
            name="interviewLength"
            id="interviewLength"
            className={styles.lengthSelect}
            value={interviewLength}
            onChange={handleInterviewLengthChange}
          >
            <option value="15">15 minutter</option>
            <option value="20">20 minutter</option>
            <option value="30">30 minutter</option>
          </select>
        </div>
        <Schedule interviewLength={Number(interviewLength)} />
      </div>
    </>
  );
};

export default Committee;

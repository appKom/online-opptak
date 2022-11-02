import { addListener } from "process";
import React from "react";
import styles from "../../styles/committee.module.css";
import arrayOfLength from "./arrayoflength";

interface Props {
  dates: { date: string; day: string }[];
}

function W2MRowHeader(props: Props) {
  return (
    <div style={{ display: "flex" }} className={styles.row}>
      <div
        className={styles.cell_timecell}
        style={{ backgroundColor: "white", height: "80px" }}
      ></div>
      {props.dates.map((date) => {
        return (
          <div
            key={date.date.toString()}
            className={`${styles.cell_headercell} text-2xl font-bold text-center`}
          >
            {date.day}
            <br></br>
            {date.date}
          </div>
        );
      })}
    </div>
  );
}

export default W2MRowHeader;

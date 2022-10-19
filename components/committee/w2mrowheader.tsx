import React from "react";
import styles from "../../styles/committee.module.css";

function W2MRowHeader() {
  return (
    <div style={{ display: "flex" }} className={styles.row}>
      <div
        className={styles.cell_timecell}
        style={{ backgroundColor: "white" }}
      ></div>
      {["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"].map((dag) => {
        return (
          <div
            key={dag}
            className={`${styles.cell_headercell} text-2xl font-bold`}
          >
            {dag}
          </div>
        );
      })}
    </div>
  );
}

export default W2MRowHeader;

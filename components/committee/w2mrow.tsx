import React from "react";
import arrayOfLength from "./arrayoflength";
import W2MCell from "./w2mcell";
import styles from "../../styles/committee.module.css";

interface Props {
  time: string;
  header?: boolean;
  mouseDown: number;
  addCell: Function;
  removeCell: Function;
}

function W2MRow(props: Props) {
  return (
    <div style={{ display: "flex" }} className={styles.row}>
      <div className={`${styles.cell_timecell} text-xl font-bold`}>
        {props.time}
      </div>
      {arrayOfLength(5).map((i) => {
        let day = ["monday", "tuesday", "wednesday", "thursday", "friday"][i];
        return (
          <W2MCell
            key={i}
            day={day}
            time={props.time}
            removeCell={(cell: string[]) => props.removeCell(cell)}
            addCell={(cell: string[]) => props.addCell(cell)}
            mouseDown={props.mouseDown}
          />
        );
      })}
    </div>
  );
}

export default W2MRow;

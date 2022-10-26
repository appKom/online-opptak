import React, { BaseSyntheticEvent } from "react";
import W2MRow from "./w2mrow";
import arrayOfLength from "./arrayoflength";
import W2MRowHeader from "./w2mrowheader";
import { useState } from "react";
import styles from "../../styles/committee.module.css";

interface Props {
  removeCell: Function;
  addCell: Function;
  resetCells: Function;
  dates: { date: string; day: string }[];
  interviewInterval: number;
}

function Whentomeet(props: Props) {
  const [mouseDown, setMouseDown] = useState(0);

  function minutesToTimeString(m: number): string {
    // ex: 120 -> 2:00, 620 -> 10:20
    let hour: number = Math.floor(m / 60);
    let minute: number = m % 60;
    return minute == 0 ? `${hour}:00` : `${hour}:${minute.toString()}`;
  }

  return (
    <div>
      <div
        className={styles.w2m_maincontainer}
        onMouseDown={() => setMouseDown(1)}
        onMouseUp={() => setMouseDown(0)}
      >
        <W2MRowHeader dates={props.dates} />
        {arrayOfLength(8 * (60 / props.interviewInterval) - 1).map((i) => {
          let time: number =
            props.interviewInterval + 8 * 60 + i * props.interviewInterval; //
          return (
            <W2MRow
              dates={props.dates}
              removeCell={(cell: string[]) => props.removeCell(cell)}
              addCell={(cell: string[]) => props.addCell(cell)}
              mouseDown={mouseDown}
              time={`${minutesToTimeString(time)} - ${minutesToTimeString(
                time + props.interviewInterval
              )}`}
              key={i.toString()}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Whentomeet;

import { useState, BaseSyntheticEvent } from "react";
import styles from "./../../styles/schedule.module.css";

interface Props {
  weekDay: String;
  time: String;
  interviewLength: number;
  isDragging: boolean;
}

export default function ScheduleCell(props: Props) {
  const [available, setAvailable] = useState(false);

  const unmarkedColor = "white";
  const markedColor = "lightgray";

  function changeColor(e: BaseSyntheticEvent) {
    let cell: HTMLDivElement = e.target;
    if (available) {
      cell.style.backgroundColor = unmarkedColor;
    } else {
      cell.style.backgroundColor = markedColor;
    }
  }

  function handleSetAvailable(e: BaseSyntheticEvent) {
    if (props.isDragging) {
      changeColor(e);
      setAvailable(!available);
      console.log(`${props.weekDay} ${props.time}`);
    }
  }

  function handleMouseDown(e: BaseSyntheticEvent) {
    changeColor(e);
    setAvailable(!available);
    console.log(`${props.weekDay} ${props.time}`);

  }

  return (
    <div
      className={styles[`cell${props.interviewLength}`]}
      onMouseEnter={handleSetAvailable}
      onMouseDown={handleMouseDown}
    ></div>
  );
}

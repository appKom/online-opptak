import { useState, BaseSyntheticEvent } from "react";
import styles from "./../../styles/schedule.module.css";

interface Props {
  weekDay: String;
  time: String;
  interviewLength: number;
  isDragging: boolean;
  slot: number;
}

export default function InterviewSlot(props: Props) {
  const [available, setAvailable] = useState(false);

  const unmarkedColor = "rgba(255, 255, 255, 0)";
  const markedColor1 = "rgba(144, 238, 144, 0.5)";
  const markedColor2 = "rgba(255, 255, 0, 0.5)";
  const markedColor3 = "rgba(255, 192, 203, 0.5)";

  function changeColor(e: BaseSyntheticEvent) {
    let cell: HTMLDivElement = e.target;
    if (available) {
      cell.style.backgroundColor = unmarkedColor;
    } else {
      if (props.slot === 1) {
        cell.style.backgroundColor = markedColor1;
      } else if (props.slot === 2) {  
        cell.style.backgroundColor = markedColor2;
      } else {
        cell.style.backgroundColor = markedColor3;
      }
    }
  }

  function handleSetAvailable(e: BaseSyntheticEvent, dragging: boolean) {
    if (dragging && !props.isDragging) {
      return;
    }
    changeColor(e);
    setAvailable((prevAvailable) => {
      const newAvailable = !prevAvailable;
      console.log(`${props.weekDay} ${props.time} number ${props.slot} ${newAvailable}`);
      return newAvailable;
    });
  }

  return (
    <div
      className={styles.interviewSlot}
      onMouseEnter={(e: BaseSyntheticEvent) => handleSetAvailable(e, true)}
      onMouseDown={(e: BaseSyntheticEvent) => handleSetAvailable(e, false)}
    ></div>
  );
}
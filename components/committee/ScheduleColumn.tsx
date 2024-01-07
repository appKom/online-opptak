import styles from "./../../styles/schedule.module.css";
import ScheduleCell from "./ScheduleCell";
import { useState } from "react";

interface Props {
  weekDay: string
  interviewLength: number
}

export default function ScheduleColumn(props: Props) {
  const [isDragging, setDragging] = useState(false);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
  }

  function handleMouseUp(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }

  const columnLength = 480/props.interviewLength;
  const tempArray = new Array(columnLength).fill(0);

  const column = tempArray.map((index) => (
    <ScheduleCell
      interviewLength={props.interviewLength}
      isDragging={isDragging}
      key={index}
    />
  ))

  return (
    <div 
      className={styles.scheduleColumn}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className={styles.headerCell}>{props.weekDay}</div>
      {column}
    </div>
  )
}
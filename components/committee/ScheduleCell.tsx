import { useState, useEffect } from "react";
import styles from "./../../styles/schedule.module.css";

interface Props {
  interviewLength: number;
  isDragging: boolean;
}

export default function ScheduleCell(props: Props) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    handleSetAvailable
  }, [props.isDragging]);

  function handleSetAvailable() {
    if (props.isDragging) {
      setAvailable(!available);
    }
  }

  function handleMouseDown() {
    setAvailable(!available);
  }

  const availableClassName = styles[`availableCell${props.interviewLength}`];
  const unavailableClassName = styles[`unavailableCell${props.interviewLength}`];

  return (
    <div
      className={available ? availableClassName : unavailableClassName}
      onMouseEnter={handleSetAvailable}
      onMouseDown={handleMouseDown}
    ></div>
  );
}

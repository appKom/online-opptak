import { useState, BaseSyntheticEvent } from "react";
import InterviewSlot from "./InterviewSlot";

interface Props {
  weekDay: String;
  time: String;
  interviewLength: number;
  isDragging: boolean;
}

export default function ScheduleCell(props: Props) {
  const [available, setAvailable] = useState(false);

  const markedColor = "lightgray";
  const unmarkedColor = "rgba(255, 255, 255, 0)";

  function changeColor(e: BaseSyntheticEvent) {
    let cell: HTMLDivElement = e.target;
    if (available) {
      cell.style.backgroundColor = unmarkedColor;
    } else {
      cell.style.backgroundColor = markedColor;
    }
  }

  function handleSetAvailable(e: BaseSyntheticEvent, dragging: boolean) {
    if (dragging && !props.isDragging) {
      return;
    }
    changeColor(e);
    setAvailable((prevAvailable) => {
      const newAvailable = !prevAvailable;
      console.log(`${props.weekDay} ${props.time} ${newAvailable}`);
      return newAvailable;
    });
  }

  return (
    <div
      className="flex border-t h-8 odd:border-dotted"
      onMouseEnter={(e: BaseSyntheticEvent) => handleSetAvailable(e, true)}
      onMouseDown={(e: BaseSyntheticEvent) => handleSetAvailable(e, false)}
      >
    </div>
  );
}

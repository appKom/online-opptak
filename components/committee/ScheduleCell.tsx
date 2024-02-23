import { useState, BaseSyntheticEvent } from "react";
import InterviewSlot from "./InterviewSlot";

interface Props {
  weekDay: String;
  time: String;
  interviewLength: number;
  isDragging: boolean;
  add: boolean;
  parallells: number;
}

export default function ScheduleCell(props: Props) {
  const [available, setAvailable] = useState(false);

  const markedColor = "lightgray";
  const unmarkedColor = "rgba(255, 255, 255, 0)";

  function handleSetAvailable() {
    setAvailable((prevAvailable) => {
      const newAvailable = !prevAvailable;
      // console.log(`${props.weekDay} ${props.time} ${newAvailable}`);
      return newAvailable;
    });
  }

  function changeColor(e: BaseSyntheticEvent) {
    let cell: HTMLDivElement = e.target;
    console.log(`Cell: ${props.add}`);
    if (available && !props.add) {
      cell.style.backgroundColor = unmarkedColor;
      handleSetAvailable();
    } else if (!available && props.add) {
      cell.style.backgroundColor = markedColor;
      handleSetAvailable();
    } else {
      return;
    }
  }

  function handleMouseEvent(e: BaseSyntheticEvent, dragging: boolean) {
    if (dragging && !props.isDragging) {
      return;
    }
    changeColor(e);
  }

  return (
    <div
      className="flex border-t border-black h-8 odd:border-dotted"
      onMouseEnter={(e: BaseSyntheticEvent) => handleMouseEvent(e, true)}
      onMouseDown={(e: BaseSyntheticEvent) => handleMouseEvent(e, false)}
      >
    </div>
  );
}

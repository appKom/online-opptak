import { useState, BaseSyntheticEvent } from "react";

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

  function handleSetAvailable() {
    setAvailable((prevAvailable) => {
      const newAvailable = !prevAvailable;
      // console.log(`${props.weekDay} ${props.time} ${newAvailable}`);
      return newAvailable;
    });
  }

  function changeColor(e: BaseSyntheticEvent) {
    let cell: HTMLDivElement = e.target;
    if (available) {
      cell.style.backgroundColor = unmarkedColor;
      handleSetAvailable();
    } else if (!available) {
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
      className="flex h-8 border-t border-gray-500 cursor-pointer odd:border-dotted"
      onMouseEnter={(e: BaseSyntheticEvent) => handleMouseEvent(e, true)}
      onMouseDown={(e: BaseSyntheticEvent) => handleMouseEvent(e, false)}
    ></div>
  );
}

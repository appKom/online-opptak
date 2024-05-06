import { useState, BaseSyntheticEvent } from "react";

interface Props {
  weekDay: String;
  time: String;
  interviewLength: number;
  isDragging: boolean;
}

export default function ScheduleCell(props: Props) {
  const [available, setAvailable] = useState(true);

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
      handleSetAvailable();
    } else if (!available) {
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

  const bgColorClass = available
    ? "bg-green-200 hover:bg-green-100"
    : "bg-red-200 hover:bg-red-100";

  return (
    <div
      className={`flex h-8 ${bgColorClass} border-t border-gray-500 cursor-pointer odd:border-dotted`}
      onMouseEnter={(e: BaseSyntheticEvent) => handleMouseEvent(e, true)}
      onMouseDown={(e: BaseSyntheticEvent) => handleMouseEvent(e, false)}
    ></div>
  );
}

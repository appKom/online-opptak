import { useState, BaseSyntheticEvent } from "react";

interface Props {
  weekDay: string;
  time: string;
  interviewLength: number;
  isDragging: boolean;
  onToggleAvailability: (
    weekDay: string,
    time: string,
    isAvailable: boolean
  ) => void;
}

export default function ScheduleCell(props: Props) {
  const [available, setAvailable] = useState(true);

  const handleToggle = () => {
    setAvailable((prevAvailable) => {
      const newAvailable = !prevAvailable;
      props.onToggleAvailability(props.weekDay, props.time, newAvailable);
      return newAvailable;
    });
  };

  const handleMouseEvent = (e: BaseSyntheticEvent, dragging: boolean) => {
    if (dragging && !props.isDragging) {
      return;
    }
    handleToggle();
  };

  const bgColorClass = available
    ? "bg-green-200 hover:bg-green-100"
    : "bg-red-200 hover:bg-red-100";

  return (
    <div
      className={`flex h-8 ${bgColorClass} border-t border-gray-500 cursor-pointer odd:border-dotted`}
      onMouseEnter={(e: BaseSyntheticEvent) => handleMouseEvent(e, true)}
      onMouseDown={(e: BaseSyntheticEvent) => handleMouseEvent(e, false)}
    />
  );
}

import ScheduleCell from "./ScheduleCell";
import { useState } from "react";
import getTimeSlots from "../../utils/getTimeSlots";

interface Props {
  weekDay: string;
  interviewLength: number;
}

export default function ScheduleColumn(props: Props) {
  const [isDragging, setDragging] = useState(false);
  const timeSlots = getTimeSlots(props.interviewLength);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
  }

  function handleMouseUp(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }

  function handleMouseLeave() {
    setDragging(false);
  }

  return (
    <div
      className="w-12 border-l border-gray-500 sm:w-24 md:w-28 lg:w-32 xl:w-36"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-center">{props.weekDay}</div>
      {timeSlots.map((time, index) => (
        <ScheduleCell
          interviewLength={props.interviewLength}
          isDragging={isDragging}
          weekDay={props.weekDay}
          time={time}
          key={index}
        />
      ))}
    </div>
  );
}

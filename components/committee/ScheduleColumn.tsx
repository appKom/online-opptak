import ScheduleCell from "./ScheduleCell";
import { useState } from "react";
import getTimeSlots from "../../utils/getTimeSlots";

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

  function handleMouseLeave() {
    setDragging(false);
  }

  const timeSlots = getTimeSlots(props.interviewLength);

  const column = timeSlots.map((time, index) => (
    <ScheduleCell
      interviewLength={props.interviewLength}
      isDragging={isDragging}
      weekDay={props.weekDay}
      time={time}
      key={index}
    />
  ))

  return (
    <div 
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-center border-l bg-online-orange">{props.weekDay}</div>
      <div className="border-l">
        {column}
      </div>
    </div>
  )
}
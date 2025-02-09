import ScheduleCell from "./ScheduleCell";
import { useState } from "react";
import getTimeSlots from "../../lib/utils/getTimeSlots";

interface Props {
  date: string;
  weekDay: string;
  interviewLength: number;
  onToggleAvailability: (
    date: string,
    time: string,
    isAvailable: boolean
  ) => void;
}

export default function ScheduleColumn({
  date,
  weekDay,
  interviewLength,
  onToggleAvailability,
}: Props) {
  const [isDragging, setDragging] = useState(false);
  const timeSlots = getTimeSlots(interviewLength);
  const dateOfMonth = date.split('-')[2];
  const month = date.split('-')[1]

  return (
    <div
      className="w-12 border-l border-gray-500 sm:w-24 md:w-28 lg:w-32 xl:w-36"
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      <div className="flex justify-center">{weekDay} {dateOfMonth}.{month}</div>
      {timeSlots.map((time, index) => (
        <ScheduleCell
          date={date}
          time={time}
          interviewLength={interviewLength}
          isDragging={isDragging}
          onToggleAvailability={onToggleAvailability}
          key={index}
        />
      ))}
    </div>
  );
}

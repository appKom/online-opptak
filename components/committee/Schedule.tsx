import ScheduleColumn from "./ScheduleColumn";
import getTimeSlots from "../../utils/getTimeSlots";

interface Props {
  interviewLength: number;
  add: boolean;
}

export default function Schedule(props : Props) {

  const timeSlots = getTimeSlots(props.interviewLength);

  const timeCells = timeSlots.map((time, index) => (
    <div className="h-8 border-t border-black text-sm" key={index}>{time}</div>
  ));

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre"];
  const columns = weekDays.map((weekDay, index) => (
    <ScheduleColumn
      weekDay={weekDay}
      interviewLength={props.interviewLength}
      key={index}
      add={props.add}
    />
  )); 

  return (
    <div className="flex border border-black mt-5">
      <div className="flex flex-col justify-end bg-blue-200">
        {timeCells}
      </div>
    {columns}
    </div>
  )
}

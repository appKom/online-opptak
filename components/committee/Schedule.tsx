import ScheduleColumn from "./ScheduleColumn";
import getTimeSlots from "../../utils/getTimeSlots";

interface Props {
  interviewLength: number;
}

export default function Schedule(props : Props) {

  const timeSlots = getTimeSlots(props.interviewLength);

  const timeCells = timeSlots.map((time, index) => (
    <div className="h-8 border-t" key={index}>{time}</div>
  ));

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre"];
  const columns = weekDays.map((weekDay, index) => (
    <ScheduleColumn
      weekDay={weekDay}
      interviewLength={props.interviewLength}
      key={index}
    />
  )); 

  return (
    <div className="flex border">
      <div className="flex flex-col justify-end bg-online-orange">
        {timeCells}
      </div>
    {columns}
    </div>
  )
}

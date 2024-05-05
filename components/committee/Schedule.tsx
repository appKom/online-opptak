import ScheduleColumn from "./ScheduleColumn";
import getTimeSlots from "../../utils/getTimeSlots";

interface Props {
  interviewLength: number;
}

export default function Schedule(props: Props) {
  const timeSlots = getTimeSlots(props.interviewLength);

  const timeCells = timeSlots.map((time, index) => (
    <div
      className="flex items-center justify-center h-8 px-4 text-sm border-t border-gray-500"
      key={index}
    >
      {time}
    </div>
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
    <div className="flex px-3 py-2 border border-gray-300 rounded-md shadow">
      <div className="flex flex-col justify-end">{timeCells}</div>
      {columns}
    </div>
  );
}

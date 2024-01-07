import styles from "./../../styles/schedule.module.css";
import ScheduleColumn from "./ScheduleColumn";

interface Props {
  interviewLength: number;
}

export default function Schedule(props : Props) {

  const startTime = new Date(0);
  startTime.setHours(8, 0, 0);

  const endTime = new Date(0);
  endTime.setHours(16, 0, 0);

  const timeSlots: string[] = [];
  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    const slotStartTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    currentTime.setMinutes(currentTime.getMinutes() + props.interviewLength);
    const slotEndTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    timeSlots.push(`${slotStartTime} - ${slotEndTime}`);
  }

  const timeCells = timeSlots.map((time, index) => (
    <div className={styles.timeCell} key={index}>{time}</div>
  ));

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const columns = weekDays.map((weekDay, index) => (
    <ScheduleColumn
      weekDay={weekDay}
      interviewLength={props.interviewLength}
      key={index}
    />
  ));

  return (
    <div className={styles.schedule}>
      <div className={styles.timeColumn}>
        <div className={styles.headerCell}></div>
        {timeCells}
      </div>
    {columns}
    </div>
  )
}

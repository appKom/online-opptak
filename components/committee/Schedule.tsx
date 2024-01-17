import styles from "./../../styles/schedule.module.css";
import ScheduleColumn from "./ScheduleColumn";
import getTimeSlots from "../../utils/getTimeSlots";

interface Props {
  interviewLength: number;
}

export default function Schedule(props : Props) {

  const timeSlots = getTimeSlots(props.interviewLength);

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

import styles from "./../../styles/schedule.module.css";
import ScheduleCell from "./ScheduleCell";

interface Props {
  time: string;
  interviewLength: number;
}

export default function ScheduleRow({ time, interviewLength }: Props) {
  const rowLength = new Array(5).fill(0);
  const row = rowLength.map((cell, index) => <ScheduleCell key={index} />);

  const rowClassName = styles[`scheduleRow${interviewLength}`];

  return (
    <div className={rowClassName}>
      <div className={styles.timeCell}>{time}</div>
      <ScheduleCell />
      <ScheduleCell />
      <ScheduleCell />
      <ScheduleCell />
      <ScheduleCell />
    </div>
  );
}

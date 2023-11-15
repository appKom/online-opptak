import { useState } from "react";
import styles from "./../../styles/schedule.module.css";
import ScheduleRow from "./ScheduleRow";

interface Props {
  interviewLength: number;
}

export default function Schedule(props: Props) {
  const days: string[] = [
    "",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
  ];
  const headerCells = days.map((day, index) => (
    <div className={styles.headerCell} key={index}>
      {day}
    </div>
  ));

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

  const rows = timeSlots.map((time, index) => (
    <ScheduleRow
      time={time}
      key={index}
      interviewLength={props.interviewLength}
    />
  ));

  return (
    <div className={styles.schedule}>
      <div className={styles.scheduleHeader}>{headerCells}</div>
      <div className={styles.scheduleBody}>{rows}</div>
    </div>
  );
}

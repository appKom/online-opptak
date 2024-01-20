import { useState, BaseSyntheticEvent } from "react";
import styles from "./../../styles/schedule.module.css";
import InterviewSlot from "./InterviewSlot";

interface Props {
  weekDay: String;
  time: String;
  interviewLength: number;
  isDragging: boolean;
}

export default function ScheduleCell(props: Props) {
  return (
    <div
      className={styles[`cell${props.interviewLength}`]}
    >
      <InterviewSlot
        weekDay={props.weekDay}
        time={props.time}
        interviewLength={props.interviewLength}
        isDragging={props.isDragging}
        slot={1}
      />
      <InterviewSlot
        weekDay={props.weekDay}
        time={props.time}
        interviewLength={props.interviewLength}
        isDragging={props.isDragging}
        slot={2}
      />
      <InterviewSlot
        weekDay={props.weekDay}
        time={props.time}
        interviewLength={props.interviewLength}
        isDragging={props.isDragging}
        slot={3}
      />
    </div>
  );
}

import { useState, BaseSyntheticEvent } from "react";
import InterviewSlot from "./InterviewSlot";

interface Props {
  weekDay: String;
  time: String;
  interviewLength: number;
  isDragging: boolean;
}

export default function ScheduleCell(props: Props) {
  return (
    <div className="flex border-t h-8 even:border-dotted">
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

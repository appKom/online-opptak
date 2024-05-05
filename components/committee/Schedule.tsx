import ScheduleColumn from "./ScheduleColumn";
import getTimeSlots from "../../utils/getTimeSlots";

interface Props {
  interviewLength: number;
}

export default function Schedule(props: Props) {
  const timeSlots = getTimeSlots(props.interviewLength);
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre"];

  return (
    <div className="flex flex-col items-center">
      <div className="flex max-w-full p-4 mb-5 text-sm text-yellow-500 rounded-md bg-yellow-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="flex-shrink-0 w-5 h-5 mr-3"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <b className="mr-2">Valgfritt</b>
        Legg til tider du&nbsp;
        <span className="font-semibold">IKKE</span>&nbsp;er ledig for intervju.
        Flere ledige tider øker sjansen for automatisk tildeling av
        intervjutider!
      </div>
      <div className="flex justify-center gap-10 text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-16 h-8 bg-green-200 border border-gray-300 rounded-sm"></div>
          Jeg er ledig
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-8 bg-red-200 border border-gray-300 rounded-sm"></div>
          <div>
            Jeg er <span className="font-bold">ikke</span> ledig
          </div>
        </div>
      </div>
      <div className="flex px-5 pt-2 pb-4 mt-5 border border-gray-300 rounded-md shadow w-max">
        <div className="flex flex-col justify-end">
          {timeSlots.map((time, index) => (
            <div
              className="flex items-center justify-center h-8 px-4 text-sm border-t border-gray-500"
              key={index}
            >
              {time}
            </div>
          ))}
        </div>
        {weekDays.map((weekDay, index) => (
          <ScheduleColumn
            weekDay={weekDay}
            interviewLength={props.interviewLength}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

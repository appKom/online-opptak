import ScheduleColumn from "./ScheduleColumn";
import getTimeSlots from "../../utils/getTimeSlots";
import { useState } from "react";
import { DeepPartial, applicantType } from "../../lib/types/types";

interface Props {
  interviewLength: number;
  periodTime: any;
  setApplicationData: Function;
  applicationData: DeepPartial<applicantType>;
}

interface TimeSlot {
  weekDay: string;
  time: string;
  available: boolean;
}

interface IsoTimeSlot {
  start: string;
  end: string;
}

export default function Schedule({
  interviewLength,
  periodTime,
  setApplicationData,
  applicationData,
}: Props) {
  const timeSlots = getTimeSlots(interviewLength);
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre"];
  const [selectedCells, setSelectedCells] = useState<TimeSlot[]>([]);
  const [isoTimeSlots, setIsoTimeSlots] = useState<IsoTimeSlot[]>([]);

  const weekdayMap: { [key: string]: number } = {
    Man: 1,
    Tir: 2,
    Ons: 3,
    Tor: 4,
    Fre: 5,
  };
  const convertToIso = (weekDay: string, timeSlot: string): IsoTimeSlot => {
    const dayOffset = weekdayMap[weekDay];
    const periodStart = new Date(periodTime.start);
    const weekdayDate = new Date(periodStart);
    weekdayDate.setDate(weekdayDate.getDate() + dayOffset);

    const [startTimeStr, endTimeStr] = timeSlot.split(" - ");
    const startTime = new Date(
      weekdayDate.getFullYear(),
      weekdayDate.getMonth(),
      weekdayDate.getDate(),
      ...parseTime(startTimeStr)
    );
    const endTime = new Date(
      weekdayDate.getFullYear(),
      weekdayDate.getMonth(),
      weekdayDate.getDate(),
      ...parseTime(endTimeStr)
    );

    return {
      start: startTime.toISOString(),
      end: endTime.toISOString(),
    };
  };

  const parseTime = (time: string): [number, number] => {
    const [timeStr, period] = time.split(" ");
    let [hour, minute] = timeStr.split(":").map(Number);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return [hour, minute];
  };

  const exportSchedule = () => {
    const selectedSet = new Set(
      selectedCells.map((cell) => `${cell.weekDay}-${cell.time}`)
    );

    const dataToSend: { weekDay: string; time: string }[] = [];
    weekDays.forEach((weekDay) => {
      timeSlots.forEach((time) => {
        const slotKey = `${weekDay}-${time}`;
        if (!selectedSet.has(slotKey)) {
          dataToSend.push({ weekDay, time });
        }
      });
    });

    const isoTimeSlotsForExport = dataToSend.map((slot) =>
      convertToIso(slot.weekDay, slot.time)
    );
    setApplicationData({
      ...applicationData,
      selectedTimes: isoTimeSlotsForExport,
    });
  };

  const handleToggleAvailability = (
    weekDay: string,
    time: string,
    available: boolean
  ) => {
    setSelectedCells((prevCells) => {
      const index = prevCells.findIndex(
        (cell) => cell.weekDay === weekDay && cell.time === time
      );
      const updatedCell = { weekDay, time, available };

      let newCells;
      if (index !== -1) {
        newCells = [...prevCells];
        newCells[index] = updatedCell;
      } else {
        newCells = [...prevCells, updatedCell];
      }
      const selectedSet = new Set(
        newCells.map((cell) => `${cell.weekDay}-${cell.time}`)
      );
      const dataToSend: { weekDay: string; time: string }[] = [];
      weekDays.forEach((day) => {
        timeSlots.forEach((slot) => {
          const slotKey = `${day}-${slot}`;
          if (!selectedSet.has(slotKey)) {
            dataToSend.push({ weekDay: day, time: slot });
          }
        });
      });

      const isoTimeSlotsForExport = dataToSend.map((slot) =>
        convertToIso(slot.weekDay, slot.time)
      );
      setApplicationData({
        ...applicationData,
        selectedTimes: isoTimeSlotsForExport,
      });

      return newCells;
    });
  };

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
            interviewLength={interviewLength}
            onToggleAvailability={handleToggleAvailability}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

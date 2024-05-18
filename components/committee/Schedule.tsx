import ScheduleColumn from "./ScheduleColumn";
import getTimeSlots from "../../utils/getTimeSlots";
import { useState, useEffect } from "react";
import { DeepPartial, applicantType } from "../../lib/types/types";

interface Props {
  interviewLength: number;
  periodTime: any;
  setApplicationData: Function;
  applicationData: DeepPartial<applicantType>;
}

interface TimeSlot {
  date: string;
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

  const [selectedCells, setSelectedCells] = useState<TimeSlot[]>([]);

  const getDatesWithinPeriod = (
    periodTime: any
  ): { [date: string]: string } => {
    const startDate = new Date(periodTime.start);
    startDate.setHours(startDate.getHours() + 2);
    const endDate = new Date(periodTime.end);
    endDate.setHours(endDate.getHours() + 2);
    const dates: { [date: string]: string } = {};
    const dayNames = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayIndex = currentDate.getDay();
      if (dayIndex !== 0 && dayIndex !== 6) {
        // Exclude Sundays and Saturdays
        const dateStr = currentDate.toISOString().split("T")[0];
        dates[dateStr] = dayNames[dayIndex];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const convertToIso = (date: string, timeSlot: string): IsoTimeSlot => {
    const [startTimeStr, endTimeStr] = timeSlot.split(" - ");
    const [year, month, day] = date.split("-").map(Number);

    const [startHour, startMinute] = parseTime(startTimeStr);
    const startTime = new Date(
      Date.UTC(year, month - 1, day, startHour, startMinute)
    );

    const [endHour, endMinute] = parseTime(endTimeStr);
    const endTime = new Date(
      Date.UTC(year, month - 1, day, endHour, endMinute)
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

  useEffect(() => {
    const dates = getDatesWithinPeriod(periodTime);
    const allAvailableTimes: { date: string; time: string }[] = [];

    Object.keys(dates).forEach((date) => {
      timeSlots.forEach((time) => {
        allAvailableTimes.push({ date, time });
      });
    });

    const isoTimeSlotsForExport = allAvailableTimes.map((slot) =>
      convertToIso(slot.date, slot.time)
    );

    setApplicationData({
      ...applicationData,
      selectedTimes: isoTimeSlotsForExport,
    });
  }, []);

  const handleToggleAvailability = (
    date: string,
    time: string,
    available: boolean
  ) => {
    setSelectedCells((prevCells) => {
      const index = prevCells.findIndex(
        (cell) => cell.date === date && cell.time === time
      );

      let newCells;
      if (index !== -1) {
        newCells = [...prevCells];
        newCells[index] = { date, time, available };
      } else {
        newCells = [...prevCells, { date, time, available }];
      }

      const selectedSet = new Set(
        newCells
          .filter((cell) => !cell.available)
          .map((cell) => `${cell.date}-${cell.time}`)
      );

      const dates = getDatesWithinPeriod(periodTime);
      const dataToSend: { date: string; time: string }[] = [];
      Object.keys(dates).forEach((date) => {
        timeSlots.forEach((slot) => {
          const slotKey = `${date}-${slot}`;
          if (!selectedSet.has(slotKey)) {
            dataToSend.push({ date, time: slot });
          }
        });
      });

      const isoTimeSlotsForExport = dataToSend.map((slot) =>
        convertToIso(slot.date, slot.time)
      );

      setApplicationData({
        ...applicationData,
        selectedTimes: isoTimeSlotsForExport,
      });

      return newCells;
    });
  };

  const dates = getDatesWithinPeriod(periodTime);

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
        {Object.keys(dates).map((date, index) => (
          <ScheduleColumn
            date={date}
            weekDay={dates[date]}
            interviewLength={interviewLength}
            onToggleAvailability={handleToggleAvailability}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

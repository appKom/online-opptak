import { HourRow } from "./hour-row";
import { Event } from "../../../lib/types/types";

type CalendarProps = {
  events: Event[];
  moveEvent: (id: string, start: string) => void;
  addEvent: (start: string) => void;
  deleteEvent: (id: string) => void;
  timePeriod: number;
  interviewPeriod: { start: Date; end: Date };
};

export const Calendar: React.FC<CalendarProps> = ({
  events,
  moveEvent,
  addEvent,
  deleteEvent,
  timePeriod,
  interviewPeriod,
}) => {
  const generateTimeSlots = (
    startHour: number,
    endHour: number,
    period: number
  ) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += period) {
        let formattedMinutes = minutes.toString().padStart(2, "0");
        if (formattedMinutes === "030") {
          formattedMinutes = "30";
        }
        let formattedHour = hour.toString().padStart(2, "0");
        const time = `${formattedHour}:${formattedMinutes}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const hours = generateTimeSlots(8, 17, timePeriod);

  // Exclude weekends
  const generateDates = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const interviewStartDate = new Date(interviewPeriod.start);
  const interviewEndDate = new Date(interviewPeriod.end);
  const dates = generateDates(interviewStartDate, interviewEndDate);

  return (
    <div className="grid grid-cols-6 gap-4 border-solid border-black rounded-lg shadow border w-full">
      <div>
        {hours.map((hour) => (
          <div key={hour} className="h-12 flex items-center justify-center">
            {hour}
          </div>
        ))}
      </div>
      {dates.map((date) => (
        <div key={date.toDateString()} className="flex flex-col">
          <h3 className="text-center">{date.toDateString()}</h3>
          <div className="flex flex-col divide-y divide-gray-200">
            {hours.map((hour) => (
              <HourRow
                key={`${date.toDateString()}-${hour}`}
                hour={hour}
                date={date}
                events={events}
                moveEvent={moveEvent}
                addEvent={addEvent}
                deleteEvent={deleteEvent}
                timePeriod={timePeriod}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

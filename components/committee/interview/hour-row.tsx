import { EventBlock } from "./event-block";
import { useDrop } from "react-dnd";
import { Event } from "../../../lib/types/types";

type HourRowProps = {
  hour: string;
  date: Date;
  events: Event[];
  moveEvent: (id: string, start: string) => void;
  addEvent: (start: string) => void;
  deleteEvent: (id: string) => void;
  timePeriod: number;
};

export const HourRow: React.FC<HourRowProps> = ({
  hour,
  date,
  events,
  moveEvent,
  addEvent,
  deleteEvent,
  timePeriod,
}) => {
  const [, drop] = useDrop({
    accept: "event",
    drop: (item: { id: string }) => {
      const start = new Date(date);
      const [hours, minutes] = hour.split(":").map(Number);
      start.setHours(hours, minutes, 0, 0);
      moveEvent(item.id, start.toISOString());
    },
  });

  return (
    <div
      ref={drop}
      className="flex items-center justify-between h-12 p-2 cursor-pointer"
      onClick={() => {
        const start = new Date(date);
        const [hours, minutes] = hour.split(":").map(Number);
        start.setHours(hours, minutes, 0, 0);
        addEvent(start.toISOString());
      }}
    >
      <div className="flex-1 flex items-center space-x-2">
        {events
          .filter(
            (event) =>
              new Date(event.start).getTime() ===
              new Date(date).setHours(
                parseInt(hour.split(":")[0]),
                parseInt(hour.split(":")[1]),
                0,
                0
              )
          )
          .map((event) => (
            <EventBlock
              key={event.id}
              event={event}
              deleteEvent={deleteEvent}
              timePeriod={timePeriod}
            />
          ))}
      </div>
    </div>
  );
};

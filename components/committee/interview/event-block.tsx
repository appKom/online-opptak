import { useDrag } from "react-dnd";
import { applicantTypeForCommittees, Event } from "../../../lib/types/types";

type EventBlockProps = {
  event: Event;
  deleteEvent: (id: string) => void;
  timePeriod: number;
};

export const EventBlock: React.FC<EventBlockProps> = ({
  event,
  deleteEvent,
  timePeriod,
}) => {
  const [, drag] = useDrag({
    type: "event",
    item: { id: event.id },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvent(event.id);
  };

  const isAvailable = (applicant: applicantTypeForCommittees, event: Event) => {
    const eventStart = new Date(event.start).toISOString();
    const eventEnd = new Date(
      new Date(event.start).getTime() + timePeriod * 60000
    ).toISOString();

    return applicant.selectedTimes.some(
      (time) => time.start <= eventStart && time.end >= eventEnd
    );
  };

  const applicant = event.applicant;
  const available = applicant ? isAvailable(applicant, event) : false;
  const backgroundColor = available ? "bg-green-500" : "bg-red-500";

  return (
    <div
      ref={drag}
      className={`${backgroundColor} text-white p-2 rounded flex items-center`}
    >
      <span>
        {applicant
          ? applicant.name + " " + event.start.slice(11, 16)
          : "No Applicant"}
      </span>
      <button onClick={handleDelete} className="ml-2 text-white">
        ✕
      </button>
    </div>
  );
};

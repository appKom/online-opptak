import { BaseSyntheticEvent, useEffect } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { periodType, committeeInterviewType } from "../../lib/types/types";
import toast from "react-hot-toast";
import NotFound from "../../pages/404";
import Button from "../Button";
import ImportantNote from "../ImportantNote";

interface Interview {
  start: string;
  end: string;
}

interface Props {
  period: periodType | null;
  committee: string;
  committeeInterviewTimes: committeeInterviewType | null;
}

const INTERVIEW_TIME_OPTIONS = ["15", "20", "30"];

const CommitteeInterviewTimes = ({
  period,
  committee,
  committeeInterviewTimes,
}: Props) => {
  const { data: session } = useSession();

  const [markedCells, setMarkedCells] = useState<Interview[]>([]);
  const [interviewInterval, setInterviewInterval] = useState(15);
  const [visibleRange, setVisibleRange] = useState({ start: "", end: "" });

  const [selectedTimeslot, setSelectedTimeslot] = useState<string>("15");

  const [calendarEvents, setCalendarEvents] = useState<Interview[]>([]);
  const [hasAlreadySubmitted, setHasAlreadySubmitted] =
    useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (period) {
      setVisibleRange({
        start: new Date(period!.interviewPeriod.start).toISOString(),
        end: new Date(period!.interviewPeriod.end).toISOString(),
      });
    }
  }, [period]);

  useEffect(() => {
    if (committee && committeeInterviewTimes) {
      const cleanString = (input: string) =>
        input
          .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
          .trim()
          .toLowerCase();

      const cleanCommittee = cleanString(committeeInterviewTimes.committee);
      const cleanSelectedCommittee = cleanString(committee);

      if (cleanCommittee === cleanSelectedCommittee) {
        setHasAlreadySubmitted(true);
        const events = committeeInterviewTimes.availabletimes.map(
          (at: any) => ({
            start: new Date(at.start).toISOString(),
            end: new Date(at.end).toISOString(),
          })
        );

        setCalendarEvents(events);
        setSelectedTimeslot(committeeInterviewTimes.timeslot);
      } else {
        setHasAlreadySubmitted(false);
        setCalendarEvents([]);
        setSelectedTimeslot("15");
      }
    }
  }, [committeeInterviewTimes, committee]);

  const createInterval = (selectionInfo: any) => {
    const event = {
      title: "",
      start: selectionInfo.start,
      end: selectionInfo.end,
    };
    selectionInfo.view.calendar.addEvent(event);
    addCell([
      selectionInfo.start.toISOString(),
      selectionInfo.end.toISOString(),
    ]);
  };

  const submit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const formattedEvents = formatEventsForExport(markedCells);
    if (formattedEvents.length === 0) {
      toast.error("Fyll inn minst et gyldig tidspunkt");
      return;
    }

    const dataToSend = {
      periodId: period!._id,
      period_name: period!.name,
      committee: committee,
      availabletimes: formattedEvents,
      timeslot: `${selectedTimeslot}`,
      message: "",
    };

    try {
      const response = await fetch(`/api/committees/times/${period?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      toast.success("Tidene er sendt inn!");
      setHasAlreadySubmitted(true);
    } catch (error) {
      toast.error("Kunne ikke sende inn!");
    }
  };

  const removeCell = (event: any) => {
    setMarkedCells((prevCells) =>
      prevCells.filter(
        (cell) => cell.start !== event.startStr && cell.end !== event.endStr
      )
    );
    event.remove();
  };

  const addCell = (cell: string[]) => {
    setMarkedCells([...markedCells, { start: cell[0], end: cell[1] }]);
  };

  const updateInterviewInterval = (e: BaseSyntheticEvent) => {
    setInterviewInterval(parseInt(e.target.value));
  };

  const renderEventContent = (eventContent: any) => {
    return (
      <div>
        <span>{eventContent.timeText}</span>
        {!hasAlreadySubmitted && (
          <button
            className="ml-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              removeCell({
                startStr: eventContent.event.start.toISOString(),
                endStr: eventContent.event.end.toISOString(),
                remove: () => eventContent.event.remove(),
              });
            }}
          >
            <img
              src="/close.svg"
              alt="close icon"
              style={{ width: "22px", height: "22px" }}
            />
          </button>
        )}
      </div>
    );
  };

  const formatEventsForExport = (events: any[]) => {
    return events
      .map((event) => {
        const startDateTimeString = `${event.start}`;
        const endDatetimeString = `${event.end}`;

        const startDateTime = new Date(startDateTimeString);
        const endDateTime = new Date(endDatetimeString);
        return {
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        };
      })
      .filter((event) => event !== null);
  };

  const handleTimeslotSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeslot(e.target.value);
  };

  const deleteSubmission = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/committees/times/${period?._id}/${committee}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      toast.success("Innsendingen er slettet!");

      setHasAlreadySubmitted(false);
      setCalendarEvents([]);
    } catch (error: any) {
      console.error("Error deleting submission:", error);
      toast.error("Klarte ikke å slette innsendingen");
    }
  };

  useEffect(() => {
    if (period) {
      setCountdown(getSubmissionDeadline());
      const intervalId = setInterval(() => {
        setCountdown(getSubmissionDeadline());
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [period]);

  const getSubmissionDeadline = (): string => {
    const deadlineIso = period!.interviewPeriod.start;

    if (deadlineIso != null) {
      const deadlineDate = new Date(deadlineIso);
      const now = new Date();

      let delta = Math.floor((deadlineDate.getTime() - now.getTime()) / 1000);

      const days = Math.floor(delta / 86400);
      delta -= days * 86400;

      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;

      const minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;

      const seconds = delta % 60;

      let result = "";
      if (days > 0) result += `${days} dager, `;
      if (hours > 0) result += `${hours} timer, `;
      if (minutes > 0) result += `${minutes} minutter, `;
      result += `${seconds} sekunder`;

      return result;
    }

    return "";
  };

  if (!session || !session.user?.isCommitee) {
    return <NotFound />;
  }

  if (period!.interviewPeriod.start < new Date()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="mt-5 mb-6 text-3xl font-bold">
          Det er ikke lenger mulig å legge inn tider!
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row gap-2 px-5 mt-5 mb-6 text-2xl font-semibold text-center">
        Legg inn ledige tider for intervjuer
      </div>
      <ImportantNote
        prefix="NB"
        text={`Fristen for å legge inn tider er ${countdown}`}
      />

      <p className="px-5 my-5 text-lg text-center">
        Velg ledige tider ved å trykke på eller dra over flere celler.
        <br></br>Intervjuene vil bli satt opp etter hverandre fra første ledige
        tid.
      </p>
      <form className="flex flex-col text-center">
        {hasAlreadySubmitted ? (
          <p className="mt-5 mb-6 text-lg text-center">
            Intervjulengde: {selectedTimeslot} min{" "}
          </p>
        ) : (
          <div className="pt-10">
            <label htmlFor="">Intervjulengde: </label>
            <select
              className="dark:bg-online-darkBlue dark:text-white"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => [
                updateInterviewInterval(e),
                handleTimeslotSelection(e),
              ]}
              name=""
              id=""
            >
              {INTERVIEW_TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time} min
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mx-4 sm:mx-20">
          <FullCalendar
            eventClassNames={"dark:bg-online-darkBlue"}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              start: "today prev,next",
              center: "",
              end: "",
            }}
            events={calendarEvents}
            selectable={!hasAlreadySubmitted}
            selectMirror={true}
            height="auto"
            select={createInterval}
            slotDuration={`00:${interviewInterval}`}
            businessHours={{ startTime: "08:00", endTime: "18:00" }}
            weekends={false}
            slotMinTime="08:00"
            slotMaxTime="18:00"
            validRange={visibleRange}
            eventContent={renderEventContent}
            eventConstraint={{ startTime: "08:00", endTime: "18:00" }}
            selectAllow={(selectInfo) => {
              const start = selectInfo.start;
              const end = selectInfo.end;
              const startHour = start.getHours();
              const endHour = end.getHours();
              const isSameDay = start.toDateString() === end.toDateString();
              return isSameDay && startHour >= 8 && endHour <= 18;
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            handleWindowResize={true}
            longPressDelay={0}
          />
        </div>

        {!hasAlreadySubmitted && (
          <label className="block mt-5 mb-2 font-medium text-m">
            Fyll ut ledige tider før du sender.
          </label>
        )}
        <div className="pt-10">
          <Button
            title={hasAlreadySubmitted ? "Slett innsending" : "Lagre og send"}
            onClick={
              hasAlreadySubmitted
                ? deleteSubmission
                : (e: BaseSyntheticEvent) => {
                    submit(e);
                  }
            }
            color={hasAlreadySubmitted ? "orange" : "blue"}
          />
        </div>
      </form>
    </div>
  );
};

export default CommitteeInterviewTimes;

import type { NextPage } from "next";
import { BaseSyntheticEvent, ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { periodType, committeeInterviewType } from "../../lib/types/types";
import toast from "react-hot-toast";
import NotFound from "../../pages/404";
import Button from "../Button";

interface Interview {
  start: string;
  end: string;
}

const INTERVIEW_TIME_OPTIONS = ["15", "20", "30"];

const CommitteeInterviewTimes: NextPage = () => {
  const { data: session } = useSession();
  const [markedCells, setMarkedCells] = useState<Interview[]>([]);
  const [interviewInterval, setInterviewInterval] = useState(20);
  const [visibleRange, setVisibleRange] = useState({ start: "", end: "" });
  const [periods, setPeriods] = useState<periodType[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [filteredCommittees, setFilteredCommittees] = useState<string[]>([]);

  const [selectedCommittee, setSelectedCommittee] = useState<string>("");
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);

  const [committeeInterviewTimes, setCommitteeInterviewTimes] = useState<
    committeeInterviewType[]
  >([]);

  const [calendarEvents, setCalendarEvents] = useState<Interview[]>([]);

  const [hasAlreadySubmitted, setHasAlreadySubmitted] =
    useState<boolean>(false);

  const [countdown, setCountdown] = useState<string>("");

  const filterCommittees = (period: periodType) => {
    const userCommittees = session?.user?.committees || [];
    const periodCommittees = period?.committees || [];
    return userCommittees.filter((committee) =>
      periodCommittees
        .map((c) => c.toLowerCase())
        .includes(committee.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchCommitteeInterviewTimes = async () => {
      try {
        const res = await fetch("/api/committees");
        const data = await res.json();

        if (data && Array.isArray(data.committees)) {
          setCommitteeInterviewTimes(data.committees);
        } else {
          console.error(
            "Fetched data does not contain an 'committees' array:",
            data
          );
          setCommitteeInterviewTimes([]);
        }
      } catch (error) {
        console.error("Error fetching committee interview times:", error);
        setCommitteeInterviewTimes([]);
      }
    };

    fetchCommitteeInterviewTimes();
  }, []);

  useEffect(() => {
    if (
      selectedPeriod &&
      selectedCommittee &&
      Array.isArray(committeeInterviewTimes)
    ) {
      const cleanString = (input: string) =>
        input
          .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
          .trim()
          .toLowerCase();

      const relevantTimes = committeeInterviewTimes.filter((time) => {
        const cleanPeriodId = cleanString(time.periodId);
        const cleanCommittee = cleanString(time.committee);
        const cleanSelectedPeriod = cleanString(selectedPeriod);
        const cleanSelectedCommittee = cleanString(selectedCommittee);

        return (
          cleanPeriodId === cleanSelectedPeriod &&
          cleanCommittee === cleanSelectedCommittee
        );
      });

      if (relevantTimes.length > 0) {
        setHasAlreadySubmitted(true);
        const events = relevantTimes.flatMap((time) =>
          time.availabletimes.map((at) => ({
            start: new Date(at.start).toISOString(),
            end: new Date(at.end).toISOString(),
          }))
        );

        setCalendarEvents(events);
      } else {
        setHasAlreadySubmitted(false);
        setCalendarEvents([]);
      }
    }
  }, [selectedPeriod, selectedCommittee, committeeInterviewTimes]);

  useEffect(() => {}, [committeeInterviewTimes]);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await fetch("/api/periods");
        const data = await res.json();
        const today = new Date();

        let availablePeriods = data.periods.filter((p: periodType) => {
          const interviewStartDate = new Date(p.interviewPeriod.start || "");
          // const endDate = new Date(p.interviewPeriod.end || "");
          return interviewStartDate >= today;
        });

        availablePeriods = filterPeriodsByCommittee(availablePeriods);

        if (availablePeriods.length > 0) {
          setPeriods(availablePeriods);
          setSelectedPeriod(availablePeriods[0]._id.toString());

          const committees = filterCommittees(availablePeriods[0]);
          setFilteredCommittees(committees);
          if (committees.length > 0) {
            setSelectedCommittee(committees[0]);
          }
          setSelectedTimeslot("15");
        } else {
          console.warn("No suitable interview periods found.");
        }

        const period = availablePeriods.find((p: periodType) => {
          const interviewStartDate = new Date(p.interviewPeriod.start || "");
          // const endDate = new Date(p.interviewPeriod.end || "");
          return interviewStartDate >= today;
        });

        if (period) {
          setVisibleRange({
            start: period.interviewPeriod.start,
            end: period.interviewPeriod.end,
          });
        } else {
          console.warn("No suitable interview period found.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch interview periods:", error);
      }
    };

    fetchPeriods();
  }, []);

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

    const selectedPeriodData = periods.find(
      (p) => p._id.toString() === selectedPeriod
    );
    if (!selectedPeriodData) {
      toast.error("No period selected or period data is missing");
      return;
    }

    const dataToSend = {
      periodId: selectedPeriodData._id,
      period_name: selectedPeriodData.name,
      committee: selectedCommittee,
      availabletimes: formattedEvents,
      timeslot: `${selectedTimeslot}`,
    };

    try {
      const response = await fetch("/api/committees", {
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

  const handleCommitteeSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCommittee(e.target.value);
  };

  const handlePeriodSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriodId = e.target.value;
    const selectedPeriodData = periods.find(
      (p) => p._id.toString() === newPeriodId
    );
    if (selectedPeriodData) {
      setSelectedPeriod(newPeriodId);
      const startDate = new Date(selectedPeriodData.interviewPeriod.start);
      const endDate = new Date(selectedPeriodData.interviewPeriod.end);

      setVisibleRange({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
    } else {
      console.warn("Selected period not found.");
    }
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

  const filterPeriodsByCommittee = (periods: periodType[]) => {
    const userCommittees = session?.user?.committees || [];
    return periods.filter((period) =>
      period.committees.some((committee) =>
        userCommittees
          .map((c) => c.toLowerCase())
          .includes(committee.toLowerCase())
      )
    );
  };

  const handleTimeslotSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeslot(e.target.value);
  };

  const deleteSubmission = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      committee: selectedCommittee,
      periodId: selectedPeriod,
    }).toString();

    try {
      const response = await fetch(`/api/committees?${queryParams}`, {
        method: "DELETE",
      });

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
    const intervalId = setInterval(() => {
      const deadline = getSubmissionDeadline();
      setCountdown(deadline);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [selectedPeriod, periods]);

  const getSubmissionDeadline = (): string => {
    const deadlineIso = periods.find(
      (period) => period._id.toString() === selectedPeriod
    )?.interviewPeriod.start;

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

  if (isLoading) {
    return (
      <div className="flex justify-center py-5 text-center">
        <p className="animate-pulse dark:text-white">Vent litt...</p>
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="mt-5 mb-6 text-3xl font-bold">Ingen aktive opptak!</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row gap-2 mt-5 mb-6 text-3xl font-bold text-center">
        <h2 className="">Legg inn ledige tider for intervjuer</h2>
      </div>
      <div className="flex max-w-full p-4 mx-5 mb-5 text-sm text-yellow-500 rounded-md dark:text-online-orange bg-yellow-50 dark:bg-gray-800">
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
        <div>
          <b className="mr-2">NB!</b>
          Fristen for å legge inn tider er {countdown}
        </div>
      </div>
      <div className="flex gap-10 w-max ">
        <div className="flex flex-col px-5 ">
          <label htmlFor="">Velg opptak: </label>
          <select
            id="period-select"
            className="p-2 ml-5 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
            onChange={handlePeriodSelection}
            value={selectedPeriod}
          >
            {periods.map((period) => (
              <option key={period._id.toString()} value={period._id.toString()}>
                {period.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col px-5">
          <label className="">Velg komitee: </label>
          <select
            className="p-2 ml-5 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
            onChange={handleCommitteeSelection}
          >
            {filteredCommittees.map((committee) => (
              <option key={committee} value={committee}>
                {committee}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="my-5 text-lg text-center">
        Velg ledige tider ved å trykke på eller dra over flere celler.
        <br></br>Intervjuene vil bli satt opp etter hverandre fra første ledige
        tid.
      </p>
      <form className="flex flex-col text-center">
        {hasAlreadySubmitted ? (
          <p className="mt-5 mb-6 text-lg text-center">
            Intervjulengde: {selectedTimeslot}min
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
        <div className="mx-20">
          <FullCalendar
            eventClassNames={"dark:bg-online-darkBlue"}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{ start: "today prev,next", center: "", end: "" }}
            events={calendarEvents}
            selectable={hasAlreadySubmitted ? false : true}
            selectMirror={true}
            height="auto"
            select={createInterval}
            slotDuration={`00:${interviewInterval}`}
            businessHours={{ startTime: "08:00", endTime: "18:00" }}
            weekends={false} //Skal helger være skrudd av?
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

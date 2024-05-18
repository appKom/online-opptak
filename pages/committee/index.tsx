import type { NextPage } from "next";
import { BaseSyntheticEvent, ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { periodType, committeeInterviewType } from "../../lib/types/types";
import toast from "react-hot-toast";
import SelectInput from "../../components/form/SelectInput";

interface Interview {
  start: string;
  end: string;
}

const INTERVIEW_TIME_OPTIONS = ["15", "20", "30"];

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [markedCells, setMarkedCells] = useState<Interview[]>([]);
  const [interviewInterval, setInterviewInterval] = useState(20);
  const [visibleRange, setVisibleRange] = useState({ start: "", end: "" });
  const [periods, setPeriods] = useState<periodType[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [filteredCommittees, setFilteredCommittees] = useState<string[]>([]);

  const [selectedCommittee, setSelectedCommittee] = useState<string>("");
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>("");

  const [committeeInterviewTimes, setCommitteeInterviewTimes] = useState<
    committeeInterviewType[]
  >([]);

  const [calendarEvents, setCalendarEvents] = useState<Interview[]>([]);

  const [hasAlreadySubmitted, setHasAlreadySubmitted] =
    useState<boolean>(false);

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
        console.log(data);

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

  if (!session || !session.user?.isCommitee) {
    return <p>Access Denied. You must be in a commitee to view this page.</p>;
  }

  if (periods.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="mt-5 mb-6 text-3xl font-bold">Ingen aktive opptakk!</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-5 mb-6 text-3xl font-bold text-center">
        Legg inn ledige tider for intervjuer
      </h2>
      <div className="flex gap-10  w-max">
        <div className="px-5 flex flex-col">
          <label htmlFor="">Velg opptak: </label>
          <select
            id="period-select"
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
        <div className="px-5 flex flex-col">
          <label>Velg komitee: </label>
          <select onChange={handleCommitteeSelection}>
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
          <label className="block mt-5 mb-2 font-medium text-black text-m">
            Fyll ut ledige tider før du sender.
          </label>
        )}
        {!hasAlreadySubmitted && (
          <button
            type="submit"
            onClick={(e: BaseSyntheticEvent) => {
              submit(e);
            }}
            className="text-white mt-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Lagre og send
          </button>
        )}
        {hasAlreadySubmitted && (
          <button
            type="reset"
            onClick={deleteSubmission}
            className="text-white mt-1 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
          >
            Slett innsending
          </button>
        )}
      </form>

      {/* {isLoading ? <p>Loading...</p> : handleValidDatesRequest(data)} */}
    </div>
  );
};

export default Committee;

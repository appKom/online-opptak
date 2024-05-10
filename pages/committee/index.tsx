import type { NextPage } from "next";
import { BaseSyntheticEvent, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { periodType, committeeInterviewType } from "../../lib/types/types";
import toast from "react-hot-toast";

interface Interview {
  start: string;
  end: string;
}

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
        const cleanPeriodId = cleanString(time._id);
        const cleanCommittee = cleanString(time.committee);
        const cleanSelectedPeriod = cleanString(selectedPeriod);
        const cleanSelectedCommittee = cleanString(selectedCommittee);

        return (
          cleanPeriodId === cleanSelectedPeriod &&
          cleanCommittee === cleanSelectedCommittee
        );
      });

      if (relevantTimes.length > 0) {
        const events = relevantTimes.flatMap((time) =>
          time.availabletimes.map((at) => ({
            start: new Date(at.start).toISOString(),
            end: new Date(at.end).toISOString(),
          }))
        );

        setCalendarEvents(events);
      } else {
        console.log("No matching events found.");
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
    // console.log(periods);
  }, []);

  function createInterval(selectionInfo: any) {
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
  }

  async function submit(e: BaseSyntheticEvent) {
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
      _id: selectedPeriodData._id,
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
      toast.success("Successfully submitted!");
      console.log("Successfully submitted data:", result);
    } catch (error) {
      console.error("Error submitting data:", error);
      // toast.error("Error during submission: " + error.message);
    }
  }

  function removeCell(event: any) {
    setMarkedCells((prevCells) =>
      prevCells.filter(
        (cell) => cell.start !== event.startStr && cell.end !== event.endStr
      )
    );
    event.remove();
  }

  function addCell(cell: string[]) {
    setMarkedCells([...markedCells, { start: cell[0], end: cell[1] }]);
  }

  function updateInterviewInterval(e: BaseSyntheticEvent) {
    setInterviewInterval(parseInt(e.target.value));
  }

  function renderEventContent(eventContent: any) {
    return (
      <div>
        <span>{eventContent.timeText}</span>
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
      </div>
    );
  }

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

  function formatEventsForExport(events: any[]) {
    return events
      .map((event) => {
        const startDateTimeString = `${event.startDate}`;
        const endDatetimeString = `${event.endDate}`;

        const startDateTime = new Date(startDateTimeString);
        const endDateTime = new Date(endDatetimeString);
        return {
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        };
      })
      .filter((event) => event !== null);
  }

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

  if (!session || !session.user?.isCommitee) {
    return <p>Access Denied. You must be in a commitee to view this page.</p>;
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <header className="text-center">
        <h2 className="text-5xl font-bold mt-5 mb-6">
          Legg inn ledige tider for intervjuer
        </h2>
      </header>
      <div className="flex flex-row pt-10 text-center justify-center">
        <div className="px-5">
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
        <div className="px-5">
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

      <div>
        <p className="text-center text-lg mt-5 mb-6">
          Velg ledige tider ved å trykke på eller dra over flere celler.
          <br></br>Intervjuene vil bli satt opp etter hverandre fra første
          ledige tid.
        </p>
      </div>
      <form className="text-center flex flex-col">
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
            <option value={"15"} key={"15"}>
              15 min
            </option>
            <option value={"20"} key={"20"}>
              20 min
            </option>
            <option value={"30"} key={"30"}>
              30 min
            </option>
          </select>
        </div>

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ start: "today prev,next", center: "", end: "" }}
          events={calendarEvents}
          selectable={true}
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
        <label className="block mb-2 mt-5 text-m font-medium text-black">
          Fyll ut ledige tider før du sender.
        </label>
        <button
          type="submit"
          onClick={(e: BaseSyntheticEvent) => {
            submit(e);
          }}
          className="text-white mt-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Lagre og send
        </button>
      </form>

      {/* {isLoading ? <p>Loading...</p> : handleValidDatesRequest(data)} */}
    </div>
  );
};

export default Committee;

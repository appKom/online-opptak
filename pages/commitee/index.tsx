import type { NextPage } from "next";
import { BaseSyntheticEvent, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { periodType } from "../../lib/types/types";

interface Interview {
  date: string;
  time: string;
}

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [markedCells, setMarkedCells] = useState<Interview[]>([]);
  const [interviewInterval, setInterviewInterval] = useState(20);
  const [visibleRange, setVisibleRange] = useState({ start: "", end: "" });
  const [periods, setPeriods] = useState<periodType[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await fetch("/api/periods");
        const data = await res.json();
        const today = new Date();

        const availablePeriods = data.periods.filter((p: periodType) => {
          const startDate = new Date(p.interviewPeriod.start || "");
          return startDate >= today;
        });
        if (availablePeriods.length > 0) {
          setPeriods(availablePeriods);
          setSelectedPeriod(availablePeriods[0].id); // Select the first period by default
        } else {
          console.warn("No suitable interview periods found.");
        }

        const period = data.periods.find((p: periodType) => {
          const startDate = new Date(p.interviewPeriod.start || "");
          const endDate = new Date(p.interviewPeriod.end || "");

          return startDate >= today && endDate >= today;
        });

        if (period) {
          console.log(period), setPeriods;
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

  const committee = "appkom";

  async function submit(e: BaseSyntheticEvent) {
    e.preventDefault();
    try {
      const body = { committee, interviews: markedCells };
      await fetch("/api/postInterviewTimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  }

  function removeCell(event: {
    startStr: string;
    endStr: string;
    remove: () => void;
  }) {
    setMarkedCells((prevCells) =>
      prevCells.filter(
        (cell) => !(cell.date === event.startStr && cell.time === event.endStr)
      )
    );
    event.remove(); // Directly remove event from calendar
  }

  function addCell(cell: string[]) {
    setMarkedCells([...markedCells, { date: cell[0], time: cell[1] }]);
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
            removeCell(eventContent.event);
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

  const handlePeriodSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

  useEffect(() => {}, []);

  if (!session || session.user?.role !== "admin") {
    //TODO sjekke komitee istedenfor admin
    return <p>Access Denied. You must be an admin to view this page.</p>;
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <header className="text-center">
        <h2 className="text-5xl font-bold mt-5 mb-6">
          Legg inn ledige tider for intervjuer
        </h2>
      </header>
      <div className="pt-10 text-center">
        <label htmlFor="">Velg opptak: </label>
        <select onChange={handlePeriodSelection} value={selectedPeriod}>
          {periods.map((period) => (
            <option key={period.name} value={period.name}>
              {period.name}
            </option>
          ))}
        </select>
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
            onChange={(e: BaseSyntheticEvent) => updateInterviewInterval(e)}
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
          selectable
          selectMirror
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

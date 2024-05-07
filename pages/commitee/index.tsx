import type { NextPage } from "next";
import { BaseSyntheticEvent, useEffect } from "react";
import styles from "../../styles/committee.module.css";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Interview {
  date: string;
  time: string;
}

const Committee: NextPage = () => {
  const { data: session } = useSession();
  const [markedCells, setMarkedCells] = useState<Interview[]>([]);
  const [interviewInterval, setInterviewInterval] = useState(20);

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

  function createInterval(selectionInfo: {
    start: Date;
    end: Date;
    allDay: boolean;
    view: {
      calendar: {
        addEvent: (arg0: { title: string; start: any; end: any }) => void;
      };
    };
  }) {
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
          weekends={false}
          slotMinTime="08:00"
          slotMaxTime="18:00"
          visibleRange={{ start: "2024-05-06", end: "2024-05-20" }}
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

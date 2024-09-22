import { useState } from "react";
import { periodType, committeeInterviewType } from "../lib/types/types";
import Button from "./Button";
import Table, { RowType } from "./Table"
import { ColumnType } from "./Table";
import TextInput from "./form/TextInput";
import DateInput from "./form/DateInput";
import TimeRangeInput from "./form/TimeRangeInput";

import toast from "react-hot-toast";

interface Interview {
  id: string;
  title: string;
  start: string;
  end: string;
}

interface RoomBooking {
  room: String,
  startDate: String
  endDate: String
}

interface Props {
  period: periodType | null;
}

const RoomInterview = ({
  period
}: Props) => {

  // TODO: Fix correct tabbing

  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([])

  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  const isValidBooking = () => {
    if (!room) {
      toast.error("Vennligst fyll inn rom")
      return false;
    }
    if (!date) {
      toast.error("Vennligst velg dato")
      return false;
    }
    if (!startTime || !endTime) {
      toast.error("Vennligst velg tidspunkt")
      return false;
    }
    if (Date.parse("2003-07-26T" + startTime) - Date.parse("2003-07-26T" + endTime) > 0) {
      toast.error("Starttid må være før sluttid")
      return false;
    }

    return true;
  }

  const handleAddBooking = () => {
    if (!isValidBooking()) return;
    addBooking()
    setRoom("")
  }

  const addBooking = () => {
    const booking: RoomBooking = {
      room: room,
      startDate: date.split("T")[0] + "T" + startTime,
      endDate: date.split("T")[0] + "T" + endTime
    }

    roomBookings.push(booking)
    setRoomBookings(roomBookings)
  }

  const columns: ColumnType[] = [
    { label: "Rom", field: "room" },
    { label: "Dato", field: "date" },
    { label: "Fra", field: "from" },
    { label: "Til", field: "to" },
    { label: "Slett", field: "delete" },
  ]

  return <div className="flex flex-col items-center">
    <h2 className="px-5 mt-5 mb-6 text-2xl font-semibold text-center">Legg inn romvalg</h2>
    <div className="mb-5 flex flex-col justify-center">
      <div className="flex flex-row justify-center gap-10 items-baseline w-full">
        <TextInput
          defaultValue={room}
          updateInputValues={(input: string) => {
            setRoom(input)
          }}
          label="Romnavn"
          className="mx-0"
        />
        <DateInput
          updateDate={(date: string) => {
            setDate(date)
          }}
          label="Test"
        />
        <TimeRangeInput
          updateTimes={(times: { start: string, end: string }) => {
            setStartTime(times.start)
            setEndTime(times.end)
          }}
          className="mx-0"
        />
      </div>
      <Button title="Legg til" color="blue" onClick={handleAddBooking}></Button>
    </div>
    <h2 className="px-5 mt-5 mb-6 text-2xl font-semibold text-center">Alle tilgjengelige romvalg</h2>
    {roomBookings.length ? <Table columns={columns} rows={roomBookings.map((roomBooking) => {
      return {
        id: roomBooking.room + "]" + roomBooking.startDate + "]" + roomBooking.endDate,
        room: roomBooking.room,
        date: roomBooking.startDate.split("T")[0],
        from: roomBooking.startDate.split("T")[1],
        to: roomBooking.endDate.split("T")[1]
      }
    })} onDelete={(id: string, name: string) => {
      const [room, startDate, endDate] = id.split("]")
      setRoomBookings(roomBookings.filter((booking, index, array) => {
        return !(booking.room == room
          && booking.startDate == startDate
          && booking.endDate == endDate)
      }))
    }} />
      : <p><i>Legg inn et rom, så dukker det opp her.</i></p>}
  </div>
};

export default RoomInterview;

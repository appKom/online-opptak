import React, { useState } from "react";
import { DBapplicant } from "../../types";

interface Props {
  data: DBapplicant;
  committee: String;
}

const Applicantrow = (props: Props) => {
  const findChoice = () => {
    switch(props.committee) {
      case props.data.committeechoice1:
        return "1.valg"
      case props.data.committeechoice2:
        return "2.valg"
      case props.data.committeechoice3:
        return "3.valg"
      default:
        return "???"
    }
  }

  const chooseRoom = () => {
    setDisplay(display=="none" ? "block" : "none");
  }

  const [display, setDisplay] = useState("none");
  const [roomName, setRoomName] = useState("Velg rom");

  return (
    <tr>
      <td className="p-5">{props.data.name}</td>
      <td className="p-5">{props.data.email}</td>
      <td className="p-5">{props.data.phone}</td>
      <td className="p-5" title={props.data.about.toString()}>{props.data.about.substring(0,30) + (props.data.about.length>30 ? "...":"")}</td>
      <td className="p-5">{props.data.informatikkyear.toString()+".års student"}</td>
      <td className="p-5">{findChoice()}</td>
      <td className="p-5 relative">
        <button onClick={() => chooseRoom()} className="w-[130px] inline-block px-7 py-3 bg-[rgb(0,84,118)] text-white font-medium text-sm leading-snug uppercase rounded shadow-md whitespace-nowrap overflow-hidden flex-no-wrap hover:bg-[rgba(0,84,118,0.8)] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out">{roomName}</button>
        <div id="roomChooser" className="p-5 bg-white shadow absolute z-10 top-0" style={{display: display}}>
          <input onChange={(e) => setRoomName(e.target.value)} className="m-2 border-b-[2px] border-[rgba(0,84,118,0.4)] focus:border-[rgb(0,84,118)] outline-none" type="text" placeholder="Rom-navn"></input>
          <input className="m-2 border-b-[2px] border-[rgba(0,84,118,0.4)] focus:border-[rgb(0,84,118)] outline-none" type="text" placeholder="Link til MazeMap"></input>
          <button onClick={() => chooseRoom()} className="m-2 inline-block px-7 py-3 bg-[rgb(0,84,118)] text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-[rgba(0,84,118,0.8)] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out">Velg rom</button>
        </div>
      </td>
      <td className="p-5"><button className="inline-block px-7 py-3 bg-[rgb(0,84,118)] text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-[rgba(0,84,118,0.8)] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out">Send mail</button></td>
    </tr>
  );
};

export default Applicantrow;

import type { NextPage } from "next";
import { BaseSyntheticEvent, useEffect } from "react";
import Whentomeet from "../components/committee/whentomeet";
import styles from "../styles/committee.module.css";
import Navbar from "../components/navbar";

import { useState } from "react";
import getValidDates from "../services/getValidDates";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ValidDates } from "../types";
import { Interview } from "@prisma/client";
import getInterviewTimes from "../services/getInterviewTimes";

const Committee: NextPage = () => {
  let markedCells: Interview[] = [];
  const [interviewInterval, setInterviewInterval] = useState(20);

  const committee = "appkom";

  let [reqstatusmsg, setReqstatusmsg] = useState({ msg: "", status: 0 });

  const {
    isLoading: isLoadingDates,
    isError: isErrorDates,
    isSuccess: isSuccessDates,
    data: queryDatesData,
  } = useQuery<{ dates: ValidDates }, Error>([], getValidDates);

  const {
    isLoading: isLoadingInterviews,
    isError: isErrorInterviews,
    isSuccess: isSuccessInterviews,
    data: queryInterviewsData,
  } = useQuery<{ interviews: Interview[] }, Error>([], getInterviewTimes);

  const handleValidDatesRequest = (data: { dates: ValidDates } | undefined) => {
    if (!data) {
      return <p>Error</p>;
    } else {
      const dates = data.dates;
      let d: { date: string; day: string }[][] = [];
      let year = dates.year;
      for (let i of dates.dates) {
        let week = [];
        for (let j of i) {
          const dd = new Date(
            parseInt(year),
            parseInt(j.split(".")[1]),
            parseInt(j.split(".")[0])
          );

          const ddd = {
            date: j,
            day: ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"][
              i.indexOf(j)
            ],
          };
          week.push(ddd);
        }
        d.push(week);
      }

      return d.map((w) => {
        return (
          <Whentomeet
            key={d.indexOf(w).toString()}
            dates={w}
            resetCells={() => resetCells()}
            removeCell={(cell: Interview) => removeCell(cell)}
            addCell={(cell: Interview) => addCell(cell)}
            interviewInterval={interviewInterval}
          />
        );
      });
    }
  };

  const handleInterviewsRequest = (
    inteviewdata: { interviews: Interview[] } | undefined
  ) => {
    console.log(inteviewdata);
    return "";
  };

  async function submit(e: BaseSyntheticEvent) {
    e.preventDefault();

    try {
      const body = { committee, interviews: markedCells };
      await fetch("/api/postInterviewTimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => {
        if (res.status === 200) {
          setReqstatusmsg({
            msg: "Intervjuene ble lagt til",
            status: res.status,
          });
        } else {
          setReqstatusmsg({ msg: "Noe gikk galt", status: res.status });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  function removeCell(cellInterview: Interview) {
    markedCells.splice(markedCells.indexOf(cellInterview), 1);
  }
  function addCell(cellInterview: Interview) {
    markedCells.push(cellInterview);
  }

  function resetCells() {
    markedCells = [];
    let cells = document.querySelectorAll<HTMLElement>(".cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "white";
      cells[i].innerText = "";
    }
  }

  function updateInterviewInterval(e: BaseSyntheticEvent) {
    setInterviewInterval(parseInt(e.target.value));
    resetCells();
  }

  return (
    <div style={{ marginBottom: "50px" }}>
      <Navbar />
      <header className="text-center">
        <h2 className="text-blue-900 text-6xl font-bold mt-5 mb-6">
          {committee.slice(0, 1).toUpperCase() + committee.slice(1)}
        </h2>
      </header>

      <p
        className={`text-center text-2xl font-bold mt-5 mb-6 ${
          reqstatusmsg.status == 200 ? "text-green-500" : "text-red-500"
        }`}
      >
        {reqstatusmsg.msg}
      </p>

      <header className="text-center">
        <h2 className="text-3xl font-bold mt-5 mb-6">
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
      <form
        className="text-center"
        style={{ width: "300px", margin: "0 auto" }}
      >
        <label className="block mb-2 mt-5 text-m font-medium text-black">
          Fyll ut ledige tider før du sender.
        </label>
        <button
          type="submit"
          onClick={(e: BaseSyntheticEvent) => {
            submit(e);
          }}
          className="text-white mt-1bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          style={{ marginBottom: "15px" }}
        >
          Lagre og send
        </button>
      </form>
      <div className={styles.interviewlengthselect}>
        <label htmlFor="">Intervjulengde: </label>
        <select
          onChange={(e: BaseSyntheticEvent) => updateInterviewInterval(e)}
          name=""
          id=""
        >
          <option value={"20"} key={"20"}>
            20 min
          </option>
          <option value={"15"} key={"15"}>
            15 min
          </option>
          <option value={"30"} key={"30"}>
            30 min
          </option>
        </select>
      </div>
      {isLoadingDates ? (
        <p>Loading...</p>
      ) : (
        <div>{handleValidDatesRequest(queryDatesData)} </div>
      )}
      {isLoadingInterviews ? (
        <p>Loading</p>
      ) : (
        handleInterviewsRequest(queryInterviewsData)
      )}
    </div>
  );
};

export default Committee;

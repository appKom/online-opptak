import type { NextPage } from "next";
import { BaseSyntheticEvent, useEffect } from "react";
import Whentomeet from "../components/committee/whentomeet";
import styles from "../styles/committee.module.css";
import Router from "next/router";
import Navbar from "../components/navbar";
import Toggle from "../components/committee/Toggle";
import Schedule from "../components/committee/Schedule";

import { useState } from "react";
import { ValidDates } from "../types";

interface Interview {
  date: string;
  time: string;
}

const Committee: NextPage = () => {
  const [add, setAdd] = useState(true);

  function handleToggle() {
    console.log("toggle");
    setAdd(!add);
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-2">
        <Toggle onClick={() => handleToggle()}/>
        <p className="mt-2 text-lg">{add ? "Legg til intervjutider" : "Fjern intervjutider"}</p>
        <Schedule interviewLength={Number(30)} add={add} />
      </div>
      <form
        className="text-center"
        style={{ width: "300px", margin: "0 auto" }}
      >
        {/*
        <div style={{ margin: "0 auto 15px" }}>
          <label
            htmlFor="first_name"
            className="block mt-4 mb-2 font-medium text-black text-m"
          >
            Komité
          </label>
       
          <select
            onChange={(e) => {
              updateCommittee(e);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {committees.map((c) => {
              return (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              );
            })}
          </select>
    
        </div>
        <div style={{ margin: "0 auto" }}>
          <label className="block mb-2 font-medium text-black text-m">
            Passord
          </label>

        <input
            onChange={(e) => {
              updatePassword(e);
            }}
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Passord"
            required
          ></input>
          
        </div>
        */}
        <label className="block mt-5 mb-2 font-medium text-black text-m">
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
      {isLoading ? <p>Loading...</p> : handleValidDatesRequest(data)}
    </div>
  );
};

export default Committee;

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { format } from "path";
import Navbar from "../components/navbar";
import styles from "../styles/Home.module.css";

const Home: NextPage = (props) => {
  return (
    <div>
      <Navbar />
      <div className="text-center">
        <h1>Go to...</h1>
        <button onClick={() => window.location.href = "form"} className="m-2 inline-block px-7 py-3 bg-[rgb(0,84,118)] text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-[rgba(0,84,118,0.8)] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out">For studenter</button>
        <button onClick={() => window.location.href = "committee"} className="m-2 inline-block px-7 py-3 bg-[rgb(0,84,118)] text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-[rgba(0,84,118,0.8)] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out">For komiteer</button>
        <button onClick={() => window.location.href = "applicantoverview"} className="m-2 inline-block px-7 py-3 bg-[rgb(0,84,118)] text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-[rgba(0,84,118,0.8)] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out">Oversikt</button>
      </div>
    </div>
  );
};

export default Home;

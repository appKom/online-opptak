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
    </div>
  );
};

export default Home;

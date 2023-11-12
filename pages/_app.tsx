import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../lib/redux/store";
import Head from "next/head";

function MyApp({ Component }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Online Opptak</title>
        <meta name="description" content="Opptakssystem for Online" />
        <link rel="icon" href="/Online_hvit_o.svg" />
      </Head>
      <Component />
    </Provider>
  );
}

export default MyApp;

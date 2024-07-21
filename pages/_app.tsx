import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingPage from "../components/LoadingPage";
import Signature from "../lib/utils/Signature";

const SessionHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  //Tihi
  useEffect(() => {
    console.log(Signature);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session && router.pathname !== "/") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || (!session && router.pathname !== "/")) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/Online_hvit_o.svg" />
        <title>Online Komitéopptak</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-white dark:text-white dark:bg-gray-900">
        <SessionHandler>
          <Toaster />
          <Navbar />
          <div className="flex-grow">
            <Component {...pageProps} />
          </div>
          <Footer />
        </SessionHandler>
      </div>
    </SessionProvider>
  );
}

export default MyApp;
